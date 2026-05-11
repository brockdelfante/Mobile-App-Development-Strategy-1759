import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { projectId } = await req.json()
  if (!projectId) return NextResponse.json({ error: 'Missing projectId' }, { status: 400 })

  const project = await prisma.project.findUnique({ where: { id: projectId } })
  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

  if (project.status === 'rendering') {
    return NextResponse.json({ error: 'Render already in progress.' }, { status: 409 })
  }

  const render = await prisma.render.create({
    data: { projectId, status: 'pending' },
  })

  // Kick off background render (fire and forget)
  // We import dynamically to avoid bundling issues
  const { startRender } = await import('@/lib/render')
  startRender(render.id).catch(err => {
    console.error('[render error]', err)
  })

  return NextResponse.json({ render }, { status: 202 })
}

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const renderId = req.nextUrl.searchParams.get('renderId')
  if (!renderId) return NextResponse.json({ error: 'Missing renderId' }, { status: 400 })

  const render = await prisma.render.findUnique({ where: { id: renderId } })
  if (!render) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ render })
}
