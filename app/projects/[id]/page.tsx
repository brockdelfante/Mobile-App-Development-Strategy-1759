import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import { checkAuthCookie } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getTemplate } from '@/lib/hyperframes/templates'
import ProjectDetail from '@/components/ProjectDetail'

interface Props {
  params: { id: string }
}

export default async function ProjectPage({ params }: Props) {
  const cookieStore = cookies()
  const authToken = cookieStore.get('auth_token')?.value
  if (!checkAuthCookie(authToken)) redirect('/login')

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      renders: { orderBy: { createdAt: 'desc' }, take: 5 },
    },
  })

  if (!project) notFound()

  const template = getTemplate(project.templateId)
  if (!template) notFound()

  const fields = JSON.parse(project.fields) as Record<string, string>
  const imagePaths = project.imagePaths ? (JSON.parse(project.imagePaths) as string[]) : []

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <a href="/projects" className="text-gray-400 hover:text-white text-sm flex items-center gap-1 mb-4 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Projects
          </a>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">{project.name}</h1>
              <p className="text-gray-400 mt-1">{template.name} · {project.aspectRatio}</p>
            </div>
          </div>
        </div>

        <ProjectDetail
          project={{
            id: project.id,
            name: project.name,
            templateId: project.templateId,
            aspectRatio: project.aspectRatio,
            status: project.status,
            fields,
            logoPath: project.logoPath ?? undefined,
            imagePaths,
            renders: project.renders.map(r => ({
              id: r.id,
              status: r.status,
              outputPath: r.outputPath ?? undefined,
              errorMsg: r.errorMsg ?? undefined,
              createdAt: r.createdAt.toISOString(),
            })),
          }}
          template={template}
        />
      </div>
    </div>
  )
}
