import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { checkAuthCookie } from '@/lib/auth'
import ProjectForm from '@/components/ProjectForm'
import { TEMPLATES } from '@/lib/hyperframes/templates'

export default function NewProjectPage() {
  const cookieStore = cookies()
  const authToken = cookieStore.get('auth_token')?.value
  if (!checkAuthCookie(authToken)) redirect('/login')

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <a href="/projects" className="text-gray-400 hover:text-white text-sm flex items-center gap-1 mb-4 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Projects
          </a>
          <h1 className="text-3xl font-bold text-white">New Project</h1>
          <p className="text-gray-400 mt-1">Configure your video project and choose a template.</p>
        </div>
        <ProjectForm templates={TEMPLATES} />
      </div>
    </div>
  )
}
