import { Template } from './templates'

export interface ValidationError {
  field: string
  message: string
}

export function validateFields(
  template: Template,
  fields: Record<string, string>
): ValidationError[] {
  const errors: ValidationError[] = []

  for (const tf of template.fields) {
    const value = fields[tf.key] ?? ''
    if (!value.trim()) {
      errors.push({ field: tf.key, message: `${tf.label} is required.` })
      continue
    }
    if (tf.maxLength && value.length > tf.maxLength) {
      errors.push({
        field: tf.key,
        message: `${tf.label} must be ${tf.maxLength} characters or fewer.`,
      })
    }
    if (tf.type === 'color' && !/^#[0-9a-fA-F]{6}$/.test(value)) {
      errors.push({ field: tf.key, message: `${tf.label} must be a valid hex color.` })
    }
  }

  return errors
}

export function validateAssets(logoPath?: string, imagePaths?: string[]): ValidationError[] {
  const errors: ValidationError[] = []
  const allowed = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']

  if (logoPath) {
    const ext = logoPath.slice(logoPath.lastIndexOf('.')).toLowerCase()
    if (!allowed.includes(ext)) {
      errors.push({ field: 'logo', message: 'Logo must be an image file (png, jpg, gif, webp, svg).' })
    }
  }

  for (const ip of imagePaths ?? []) {
    const ext = ip.slice(ip.lastIndexOf('.')).toLowerCase()
    if (!allowed.includes(ext)) {
      errors.push({ field: 'images', message: `Image "${ip}" is not a supported format.` })
    }
  }

  return errors
}
