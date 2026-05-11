import fs from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const UPLOADS_DIR = path.join(process.cwd(), 'uploads')
const OUTPUTS_DIR = path.join(process.cwd(), 'outputs')

export async function ensureDirs() {
  await fs.mkdir(UPLOADS_DIR, { recursive: true })
  await fs.mkdir(OUTPUTS_DIR, { recursive: true })
}

export async function saveUploadedFile(
  data: Buffer,
  originalName: string,
  subDir = ''
): Promise<string> {
  await ensureDirs()
  const ext = path.extname(originalName)
  const filename = `${uuidv4()}${ext}`
  const dir = subDir
    ? path.join(UPLOADS_DIR, subDir)
    : UPLOADS_DIR
  await fs.mkdir(dir, { recursive: true })
  const filePath = path.join(dir, filename)
  await fs.writeFile(filePath, data)
  return filePath
}

export async function getOutputPath(renderId: string): Promise<string> {
  await ensureDirs()
  return path.join(OUTPUTS_DIR, `${renderId}.mp4`)
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

export async function readFileAsBuffer(filePath: string): Promise<Buffer> {
  return fs.readFile(filePath)
}

export { UPLOADS_DIR, OUTPUTS_DIR }
