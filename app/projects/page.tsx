import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { checkAuthCookie } from '@/lib/auth'
import { prisma } from '@/lib/db'

export default async function ProjectsPage() {
  const cookieStore = cookies()
  const authToken = cookieStore.get('auth_token')?.value
  if (!checkAuthCookie(authToken)) redirect('/login')

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Social Video Generator</h1>
            <p className="text-gray-400 mt-1">Internal tool powered by HyperFrames</p>
          </div>
          <Link
            href="/projects/new"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </Link>
        </div>

        {/* Projects grid */}
        {projects.length === 0 ? (
          <div className="glass rounded-2xl p-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.882v6.236a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No projects yet</h2>
            <p className="text-gray-400 mb-6">Create your first social video project to get started.</p>
            <Link
              href="/projects/new"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Create Project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(project => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="glass rounded-xl p-6 hover:bg-white/10 transition-colors group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-lg truncate group-hover:text-indigo-300 transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">{project.templateId} · {project.aspectRatio}</p>
                  </div>
                  <StatusBadge status={project.status} />
                </div>
                <p className="text-gray-500 text-xs">
                  {new Date(project.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric', month: 'short', day: 'numeric'
                  })}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    draft: 'bg-gray-700 text-gray-300',
    rendering: 'bg-yellow-900/60 text-yellow-300',
    done: 'bg-green-900/60 text-green-300',
    error: 'bg-red-900/60 text-red-300',
  }
  const cls = map[status] ?? 'bg-gray-700 text-gray-300'
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${cls} capitalize flex-shrink-0`}>
      {status}
    </span>
  )
}
