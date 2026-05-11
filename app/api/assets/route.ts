import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { saveUploadedFile } from '@/lib/storage'
import { prisma } from '@/lib/db'

const MAX_SIZE = 20 * 1024 * 1024 // 20 MB

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const projectId = formData.get('projectId') as string
  const type = formData.get('type') as 'logo' | 'image' // logo or image
  const file = formData.get('file') as File | null

  if (!projectId || !file || !type) {
    return NextResponse.json({ error: 'Missing projectId, type, or file.' }, { status: 400 })
  }

  const project = await prisma.project.findUnique({ where: { id: projectId } })
  if (!project) return NextResponse.json({ error: 'Project not found.' }, { status: 404 })

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large. Max 20MB.' }, { status: 400 })
  }

  const allowed = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml']
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: 'Unsupported file type.' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const filePath = await saveUploadedFile(buffer, file.name, projectId)

  if (type === 'logo') {
    await prisma.project.update({
      where: { id: projectId },
      data: { logoPath: filePath },
    })
  } else {
    const existing = project.imagePaths ? (JSON.parse(project.imagePaths) as string[]) : []
    existing.push(filePath)
    await prisma.project.update({
      where: { id: projectId },
      data: { imagePaths: JSON.stringify(existing) },
    })
  }

  return NextResponse.json({ filePath }, { status: 201 })
}
