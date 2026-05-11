'use client'

import { useEffect, useState } from 'react'

interface Render {
  id: string
  status: string
  outputPath?: string
  errorMsg?: string
  createdAt: string
}

interface Props {
  projectId: string
  initialRenders: Render[]
}

export default function RenderStatus({ projectId, initialRenders }: Props) {
  const [renders, setRenders] = useState<Render[]>(initialRenders)
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState('')

  const latestRender = renders[0]
  const isRunning = latestRender?.status === 'pending' || latestRender?.status === 'running'

  // Poll while render is running
  useEffect(() => {
    if (!isRunning || !latestRender) return
    const interval = setInterval(async () => {
      const res = await fetch(`/api/renders?renderId=${latestRender.id}`)
      if (!res.ok) return
      const { render } = await res.json()
      setRenders(prev => prev.map(r => (r.id === render.id ? { ...r, ...render } : r)))
    }, 2000)
    return () => clearInterval(interval)
  }, [isRunning, latestRender?.id])

  async function startRender() {
    setStarting(true)
    setError('')
    const res = await fetch('/api/renders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId }),
    })
    const data = await res.json()
    if (res.ok) {
      setRenders(prev => [{ ...data.render, createdAt: new Date().toISOString() }, ...prev])
    } else {
      setError(data.error ?? 'Failed to start render')
    }
    setStarting(false)
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-lg font-semibold text-white">Render</h2>
        <button
          onClick={startRender}
          disabled={starting || isRunning}
          className="flex items-center gap-1.5 px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
        >
          {starting || isRunning ? (
            <>
              <span className="animate-spin w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full" />
              {starting ? 'Starting…' : 'Rendering…'}
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Render MP4
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-950/40 border border-red-700/50 rounded-lg p-3 text-red-300 text-sm mb-4">
          {error}
        </div>
      )}

      {renders.length === 0 ? (
        <p className="text-gray-500 text-sm">No renders yet. Click Render MP4 to start.</p>
      ) : (
        <div className="space-y-2">
          {renders.map(r => (
            <RenderRow key={r.id} render={r} />
          ))}
        </div>
      )}
    </div>
  )
}

function RenderRow({ render }: { render: Render }) {
  const statusConfig: Record<string, { label: string; cls: string }> = {
    pending:  { label: 'Queued',    cls: 'bg-gray-700 text-gray-300' },
    running:  { label: 'Rendering', cls: 'bg-yellow-900/60 text-yellow-300' },
    done:     { label: 'Done',      cls: 'bg-green-900/60 text-green-300' },
    error:    { label: 'Error',     cls: 'bg-red-900/60 text-red-300' },
  }
  const { label, cls } = statusConfig[render.status] ?? { label: render.status, cls: 'bg-gray-700 text-gray-300' }

  return (
    <div className="glass rounded-lg p-3 flex items-center gap-3">
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>{label}</span>
      {(render.status === 'pending' || render.status === 'running') && (
        <span className="animate-spin w-3.5 h-3.5 border-2 border-yellow-500/30 border-t-yellow-400 rounded-full" />
      )}
      <span className="text-gray-500 text-xs flex-1">
        {new Date(render.createdAt).toLocaleString()}
      </span>
      {render.status === 'done' && (
        <a
          href={`/api/download?renderId=${render.id}`}
          download
          className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download MP4
        </a>
      )}
      {render.status === 'error' && render.errorMsg && (
        <span className="text-red-400 text-xs truncate max-w-xs" title={render.errorMsg}>
          {render.errorMsg.slice(0, 80)}
        </span>
      )}
    </div>
  )
}
