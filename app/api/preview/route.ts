import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { composeHTML } from '@/lib/hyperframes/compose'
import { getTemplate } from '@/lib/hyperframes/templates'

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const projectId = req.nextUrl.searchParams.get('projectId')
  if (!projectId) return NextResponse.json({ error: 'Missing projectId' }, { status: 400 })

  const project = await prisma.project.findUnique({ where: { id: projectId } })
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const template = getTemplate(project.templateId)
  if (!template) return NextResponse.json({ error: 'Template not found' }, { status: 404 })

  const fields = JSON.parse(project.fields) as Record<string, string>
  const imagePaths = project.imagePaths ? (JSON.parse(project.imagePaths) as string[]) : []

  const html = composeHTML({
    template,
    fields,
    logoPath: project.logoPath ?? undefined,
    imagePaths,
  })

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
