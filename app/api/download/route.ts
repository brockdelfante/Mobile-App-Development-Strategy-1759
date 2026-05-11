import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { readFileAsBuffer, fileExists } from '@/lib/storage'

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const renderId = req.nextUrl.searchParams.get('renderId')
  if (!renderId) return NextResponse.json({ error: 'Missing renderId' }, { status: 400 })

  const render = await prisma.render.findUnique({ where: { id: renderId } })
  if (!render || render.status !== 'done' || !render.outputPath) {
    return NextResponse.json({ error: 'Render not available.' }, { status: 404 })
  }

  if (!(await fileExists(render.outputPath))) {
    return NextResponse.json({ error: 'Output file not found on disk.' }, { status: 404 })
  }

  const buffer = await readFileAsBuffer(render.outputPath)

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'video/mp4',
      'Content-Disposition': `attachment; filename="render-${renderId}.mp4"`,
      'Content-Length': buffer.length.toString(),
    },
  })
}
