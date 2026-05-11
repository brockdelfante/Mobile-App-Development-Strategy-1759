import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getTemplate } from '@/lib/hyperframes/templates'
import { validateFields } from '@/lib/hyperframes/validate'

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ projects })
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, templateId, aspectRatio, fields } = body

  if (!name?.trim()) return NextResponse.json({ error: 'Project name is required.' }, { status: 400 })

  const template = getTemplate(templateId)
  if (!template) return NextResponse.json({ error: 'Invalid template.' }, { status: 400 })

  const fieldErrors = validateFields(template, fields ?? {})
  if (fieldErrors.length > 0) {
    return NextResponse.json({ error: 'Validation failed', details: fieldErrors }, { status: 400 })
  }

  const project = await prisma.project.create({
    data: {
      name: name.trim(),
      templateId,
      aspectRatio: aspectRatio || template.aspectRatio,
      fields: JSON.stringify(fields ?? {}),
    },
  })

  return NextResponse.json({ project }, { status: 201 })
}
