export type AspectRatio = '1:1' | '9:16' | '16:9'

export interface TemplateField {
  key: string
  label: string
  type: 'text' | 'textarea' | 'color'
  defaultValue: string
  maxLength?: number
}

export interface Template {
  id: string
  name: string
  description: string
  aspectRatio: AspectRatio
  width: number
  height: number
  duration: number // seconds
  thumbnail: string
  fields: TemplateField[]
}

export const TEMPLATES: Template[] = [
  {
    id: 'social-square',
    name: 'Social Square',
    description: 'Clean 1:1 square format with bold headline and logo.',
    aspectRatio: '1:1',
    width: 1080,
    height: 1080,
    duration: 8,
    thumbnail: '/thumbnails/social-square.png',
    fields: [
      { key: 'headline', label: 'Headline', type: 'text', defaultValue: 'Your Bold Headline', maxLength: 60 },
      { key: 'subheadline', label: 'Subheadline', type: 'text', defaultValue: 'Supporting message goes here', maxLength: 100 },
      { key: 'cta', label: 'Call to Action', type: 'text', defaultValue: 'Learn More', maxLength: 30 },
      { key: 'bgColor', label: 'Background Color', type: 'color', defaultValue: '#1a1a2e' },
      { key: 'accentColor', label: 'Accent Color', type: 'color', defaultValue: '#e94560' },
    ],
  },
  {
    id: 'social-story',
    name: 'Social Story',
    description: 'Vertical 9:16 story format with animated text reveal.',
    aspectRatio: '9:16',
    width: 1080,
    height: 1920,
    duration: 10,
    thumbnail: '/thumbnails/social-story.png',
    fields: [
      { key: 'headline', label: 'Headline', type: 'text', defaultValue: 'Big Announcement', maxLength: 40 },
      { key: 'body', label: 'Body Text', type: 'textarea', defaultValue: 'Share your story with the world. Keep it short and impactful.', maxLength: 150 },
      { key: 'cta', label: 'Call to Action', type: 'text', defaultValue: 'Swipe Up', maxLength: 25 },
      { key: 'bgColor', label: 'Background Color', type: 'color', defaultValue: '#0f3460' },
      { key: 'accentColor', label: 'Accent Color', type: 'color', defaultValue: '#e94560' },
    ],
  },
  {
    id: 'social-landscape',
    name: 'Social Landscape',
    description: 'Wide 16:9 landscape format suitable for YouTube and LinkedIn.',
    aspectRatio: '16:9',
    width: 1920,
    height: 1080,
    duration: 10,
    thumbnail: '/thumbnails/social-landscape.png',
    fields: [
      { key: 'headline', label: 'Headline', type: 'text', defaultValue: 'Your Main Message', maxLength: 70 },
      { key: 'subheadline', label: 'Subheadline', type: 'text', defaultValue: 'A compelling supporting statement', maxLength: 120 },
      { key: 'author', label: 'Author / Brand Name', type: 'text', defaultValue: 'Your Brand', maxLength: 40 },
      { key: 'bgColor', label: 'Background Color', type: 'color', defaultValue: '#16213e' },
      { key: 'accentColor', label: 'Accent Color', type: 'color', defaultValue: '#0f3460' },
    ],
  },
]

export function getTemplate(id: string): Template | undefined {
  return TEMPLATES.find(t => t.id === id)
}
