import { exec } from 'child_process'
import fs from 'fs/promises'
import path from 'path'
import { promisify } from 'util'
import { prisma } from './db'
import { composeHTML } from './hyperframes/compose'
import { getTemplate } from './hyperframes/templates'
import { getOutputPath } from './storage'

const execAsync = promisify(exec)

const COMPOSITIONS_DIR = path.join(process.cwd(), '.compositions')

async function writeCompositionFile(renderId: string, html: string): Promise<string> {
  await fs.mkdir(COMPOSITIONS_DIR, { recursive: true })
  const filePath = path.join(COMPOSITIONS_DIR, `${renderId}.html`)
  await fs.writeFile(filePath, html, 'utf-8')
  return filePath
}

export async function startRender(renderId: string): Promise<void> {
  const render = await prisma.render.findUnique({
    where: { id: renderId },
    include: { project: true },
  })

  if (!render) throw new Error(`Render ${renderId} not found`)

  const project = render.project
  const template = getTemplate(project.templateId)
  if (!template) throw new Error(`Template ${project.templateId} not found`)

  const fields = JSON.parse(project.fields) as Record<string, string>
  const imagePaths = project.imagePaths ? (JSON.parse(project.imagePaths) as string[]) : []

  // Mark as running
  await prisma.render.update({
    where: { id: renderId },
    data: { status: 'running', startedAt: new Date() },
  })
  await prisma.project.update({
    where: { id: project.id },
    data: { status: 'rendering' },
  })

  try {
    const html = composeHTML({
      template,
      fields,
      logoPath: project.logoPath ?? undefined,
      imagePaths,
    })

    const compositionPath = await writeCompositionFile(renderId, html)
    const outputPath = await getOutputPath(renderId)

    // Run HyperFrames render CLI
    const { stdout, stderr } = await execAsync(
      `npx hyperframes render "${compositionPath}" --output "${outputPath}"`,
      { timeout: 5 * 60 * 1000 } // 5 min timeout
    )

    console.log('[render stdout]', stdout)
    if (stderr) console.warn('[render stderr]', stderr)

    // Verify output exists
    await fs.access(outputPath)

    await prisma.render.update({
      where: { id: renderId },
      data: { status: 'done', outputPath, finishedAt: new Date() },
    })
    await prisma.project.update({
      where: { id: project.id },
      data: { status: 'done', renderPath: outputPath },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    await prisma.render.update({
      where: { id: renderId },
      data: { status: 'error', errorMsg: msg, finishedAt: new Date() },
    })
    await prisma.project.update({
      where: { id: project.id },
      data: { status: 'error', errorMsg: msg },
    })
    throw err
  }
}
