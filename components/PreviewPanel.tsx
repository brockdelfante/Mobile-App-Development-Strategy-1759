'use client'

import { useState } from 'react'
import { Template } from '@/lib/hyperframes/templates'

interface Props {
  projectId: string
  template: Template
}

const SCALE: Record<string, number> = {
  '1:1': 0.28,
  '9:16': 0.22,
  '16:9': 0.35,
}

export default function PreviewPanel({ projectId, template }: Props) {
  const [loading, setLoading] = useState(false)
  const [key, setKey] = useState(0)
  const [showPreview, setShowPreview] = useState(false)

  const scale = SCALE[template.aspectRatio] ?? 0.3
  const previewW = Math.round(template.width * scale)
  const previewH = Math.round(template.height * scale)

  function refresh() {
    setLoading(true)
    setShowPreview(true)
    setKey(k => k + 1)
  }

  const previewUrl = `/api/preview?projectId=${projectId}&t=${key}`

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-lg font-semibold text-white">Preview</h2>
        <button
          onClick={refresh}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 text-gray-300 rounded-lg transition-colors disabled:opacity-50"
        >
          <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {showPreview ? 'Refresh' : 'Preview'}
        </button>
      </div>

      {!showPreview ? (
        <div
          className="glass rounded-xl flex items-center justify-center text-gray-500 text-sm"
          style={{ width: previewW, height: previewH }}
        >
          Click Preview to render
        </div>
      ) : (
        <div
          className="rounded-xl overflow-hidden border border-white/10 relative bg-black"
          style={{ width: previewW, height: previewH }}
        >
          <iframe
            key={key}
            src={previewUrl}
            style={{
              width: template.width,
              height: template.height,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              border: 'none',
              display: 'block',
            }}
            onLoad={() => setLoading(false)}
            title="Composition Preview"
            sandbox="allow-scripts"
          />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <span className="animate-spin w-6 h-6 border-2 border-white/30 border-t-white rounded-full" />
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-gray-500 mt-2">
        {template.width}×{template.height} · {template.duration}s
      </p>
    </div>
  )
}
