'use client'

import { Template } from '@/lib/hyperframes/templates'

interface Props {
  templates: Template[]
  selected: string
  onChange: (id: string) => void
}

const RATIO_ICON: Record<string, string> = {
  '1:1': '■',
  '9:16': '▐',
  '16:9': '▬',
}

export default function TemplatePicker({ templates, selected, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {templates.map(t => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={`text-left rounded-xl border-2 p-4 transition-all ${
            selected === t.id
              ? 'border-indigo-500 bg-indigo-950/40'
              : 'border-white/10 bg-white/5 hover:border-white/30'
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl text-indigo-400">{RATIO_ICON[t.aspectRatio] ?? '◆'}</span>
            <div>
              <div className="font-semibold text-white text-sm">{t.name}</div>
              <div className="text-xs text-gray-400">{t.aspectRatio} · {t.width}×{t.height}</div>
            </div>
            {selected === t.id && (
              <span className="ml-auto text-indigo-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">{t.description}</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-gray-500">{t.duration}s</span>
            <span className="text-gray-600">·</span>
            <span className="text-xs text-gray-500">{t.fields.length} fields</span>
          </div>
        </button>
      ))}
    </div>
  )
}
