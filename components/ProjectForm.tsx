'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Template } from '@/lib/hyperframes/templates'
import TemplatePicker from './TemplatePicker'

interface Props {
  templates: Template[]
}

export default function ProjectForm({ templates }: Props) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]?.id ?? '')
  const [fields, setFields] = useState<Record<string, string>>(() => {
    const t = templates[0]
    if (!t) return {}
    return Object.fromEntries(t.fields.map(f => [f.key, f.defaultValue]))
  })
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [globalError, setGlobalError] = useState('')

  const template = templates.find(t => t.id === selectedTemplate)

  function handleTemplateChange(id: string) {
    setSelectedTemplate(id)
    const t = templates.find(tt => tt.id === id)
    if (t) {
      setFields(Object.fromEntries(t.fields.map(f => [f.key, f.defaultValue])))
    }
    setErrors({})
  }

  function setField(key: string, value: string) {
    setFields(prev => ({ ...prev, [key]: value }))
    setErrors(prev => { const n = { ...prev }; delete n[key]; return n })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setGlobalError('')

    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        templateId: selectedTemplate,
        aspectRatio: template?.aspectRatio,
        fields,
      }),
    })
    const data = await res.json()

    if (res.ok) {
      router.push(`/projects/${data.project.id}`)
    } else if (data.details) {
      const errs: Record<string, string> = {}
      for (const d of data.details) errs[d.field] = d.message
      setErrors(errs)
    } else {
      setGlobalError(data.error ?? 'Failed to create project')
    }
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Project name */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Project Name</h2>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Q2 Product Launch"
          required
          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Template picker */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Choose Template</h2>
        <TemplatePicker
          templates={templates}
          selected={selectedTemplate}
          onChange={handleTemplateChange}
        />
      </div>

      {/* Template fields */}
      {template && (
        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Customize Content</h2>
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
                      placeholder="#000000"
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
                {errors[f.key] && <p className="text-red-400 text-xs mt-1">{errors[f.key]}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {globalError && (
        <div className="bg-red-950/40 border border-red-700/50 rounded-xl p-4 text-red-300 text-sm">
          {globalError}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          {saving ? 'Creating…' : 'Create Project'}
        </button>
        <a
          href="/projects"
          className="px-6 py-3 rounded-xl border border-white/20 text-gray-300 hover:bg-white/10 transition-colors text-sm font-medium"
        >
          Cancel
        </a>
      </div>
    </form>
  )
}
