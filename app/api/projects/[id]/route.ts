import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getTemplate } from '@/lib/hyperframes/templates'
import { validateFields } from '@/lib/hyperframes/validate'

interface Context { params: { id: string } }

export async function GET(req: NextRequest, { params }: Context) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: { renders: { orderBy: { createdAt: 'desc' }, take: 10 } },
  })
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ project })
}

export async function PATCH(req: NextRequest, { params }: Context) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, fields, logoPath, imagePaths } = body

  const existing = await prisma.project.findUnique({ where: { id: params.id } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (fields) {
    const template = getTemplate(existing.templateId)
    if (template) {
      const errs = validateFields(template, fields)
      if (errs.length > 0) {
        return NextResponse.json({ error: 'Validation failed', details: errs }, { status: 400 })
      }
    }
  }

  const updated = await prisma.project.update({
    where: { id: params.id },
    data: {
      ...(name ? { name: name.trim() } : {}),
      ...(fields ? { fields: JSON.stringify(fields) } : {}),
      ...(logoPath !== undefined ? { logoPath } : {}),
      ...(imagePaths !== undefined ? { imagePaths: JSON.stringify(imagePaths) } : {}),
      status: 'draft',
      errorMsg: null,
    },
  })

  return NextResponse.json({ project: updated })
}

export async function DELETE(req: NextRequest, { params }: Context) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.project.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
