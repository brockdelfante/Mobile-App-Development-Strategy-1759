'use client'

import { useState } from 'react'
import { Template } from '@/lib/hyperframes/templates'
import PreviewPanel from './PreviewPanel'
import RenderStatus from './RenderStatus'
import AssetUploader from './AssetUploader'

interface ProjectData {
  id: string
  name: string
  templateId: string
  aspectRatio: string
  status: string
  fields: Record<string, string>
  logoPath?: string
  imagePaths: string[]
  renders: Array<{
    id: string
    status: string
    outputPath?: string
    errorMsg?: string
    createdAt: string
  }>
}

interface Props {
  project: ProjectData
  template: Template
}

export default function ProjectDetail({ project, template }: Props) {
  const [fields, setFields] = useState(project.fields)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveOk, setSaveOk] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [logoUploaded, setLogoUploaded] = useState(!!project.logoPath)
  const [imageUploaded, setImageUploaded] = useState(project.imagePaths.length > 0)

  function setField(key: string, value: string) {
    setFields(prev => ({ ...prev, [key]: value }))
    setFieldErrors(prev => { const n = { ...prev }; delete n[key]; return n })
    setSaveOk(false)
  }

  async function saveFields() {
    setSaving(true)
    setSaveError('')
    setSaveOk(false)
    const res = await fetch(`/api/projects/${project.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields }),
    })
    const data = await res.json()
    if (res.ok) {
      setSaveOk(true)
    } else if (data.details) {
      const errs: Record<string, string> = {}
      for (const d of data.details) errs[d.field] = d.message
      setFieldErrors(errs)
    } else {
      setSaveError(data.error ?? 'Save failed')
    }
    setSaving(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: editable fields */}
      <div className="lg:col-span-2 space-y-6">
        {/* Content fields */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Content</h2>
          <div className="space-y-5">
            {template.fields.map(f => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {f.label}
                  {f.maxLength && (
                    <span className="text-gray-500 ml-2 font-normal">
                      {(fields[f.key] ?? '').length}/{f.maxLength}
                    </span>
                  )}
                </label>
                {f.type === 'textarea' ? (
                  <textarea
                    value={fields[f.key] ?? ''}
                    onChange={e => setField(f.key, e.target.value)}
                    maxLength={f.maxLength}
                    rows={3}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                ) : f.type === 'color' ? (
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={fields[f.key] ?? '#000000'}
                      onChange={e => setField(f.key, e.target.value)}
                      className="w-12 h-10 rounded cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={fields[f.key] ?? ''}
                      onChange={e => setField(f.key, e.target.value)}
                      className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    value={fields[f.key] ?? ''}
                    onChange={e => setField(f.key, e.target.value)}
                    maxLength={f.maxLength}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                )}
                {fieldErrors[f.key] && <p className="text-red-400 text-xs mt-1">{fieldErrors[f.key]}</p>}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={saveFields}
              disabled={saving}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white font-medium px-5 py-2 rounded-lg transition-colors text-sm"
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            {saveOk && <span className="text-green-400 text-sm">Saved!</span>}
            {saveError && <span className="text-red-400 text-sm">{saveError}</span>}
          </div>
        </div>

        {/* Assets */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Assets</h2>
          <div className="flex flex-wrap gap-3">
            <AssetUploader
              projectId={project.id}
              type="logo"
              label="Logo"
              onUploaded={() => setLogoUploaded(true)}
            />
            <AssetUploader
              projectId={project.id}
              type="image"
              label="Background Image"
              onUploaded={() => setImageUploaded(true)}
            />
          </div>
          {(logoUploaded || imageUploaded) && (
            <p className="text-xs text-gray-500 mt-3">
              Assets saved. Refresh the preview to see them applied.
            </p>
          )}
        </div>

        {/* Render */}
        <div className="glass rounded-xl p-6">
          <RenderStatus projectId={project.id} initialRenders={project.renders} />
        </div>
      </div>

      {/* Right: preview */}
      <div>
        <div className="glass rounded-xl p-6 sticky top-6">
          <PreviewPanel projectId={project.id} template={template} />
        </div>
      </div>
    </div>
  )
}
