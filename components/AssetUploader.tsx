'use client'

import { useRef, useState } from 'react'

interface Props {
  projectId: string
  type: 'logo' | 'image'
  label: string
  onUploaded: (path: string) => void
}

export default function AssetUploader({ projectId, type, label, onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [uploaded, setUploaded] = useState(false)

  async function handleFile(file: File) {
    setUploading(true)
    setError('')

    const fd = new FormData()
    fd.append('projectId', projectId)
    fd.append('type', type)
    fd.append('file', file)

    const res = await fetch('/api/assets', { method: 'POST', body: fd })
    const data = await res.json()

    if (res.ok) {
      setUploaded(true)
      onUploaded(data.filePath)
    } else {
      setError(data.error ?? 'Upload failed')
    }
    setUploading(false)
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
          uploaded
            ? 'border-green-600 text-green-400 bg-green-950/30'
            : 'border-white/20 text-gray-300 bg-white/5 hover:bg-white/10'
        } disabled:opacity-50`}
      >
        {uploading ? (
          <>
            <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
            Uploading…
          </>
        ) : uploaded ? (
          <>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {label} uploaded
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload {label}
          </>
        )}
      </button>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )
}
