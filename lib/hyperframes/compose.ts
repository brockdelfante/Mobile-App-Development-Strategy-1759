import path from 'path'
import { Template } from './templates'

interface ComposeOptions {
  template: Template
  fields: Record<string, string>
  logoPath?: string
  imagePaths?: string[]
}

export function composeHTML(opts: ComposeOptions): string {
  const { template, fields, logoPath, imagePaths } = opts

  switch (template.id) {
    case 'social-square':
      return composeSocialSquare({ fields, logoPath, imagePaths, template })
    case 'social-story':
      return composeSocialStory({ fields, logoPath, imagePaths, template })
    case 'social-landscape':
      return composeSocialLandscape({ fields, logoPath, imagePaths, template })
    default:
      throw new Error(`Unknown template: ${template.id}`)
  }
}

function escape(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function toFileUrl(p: string): string {
  if (!p) return ''
  // If already a URL, return as-is
  if (p.startsWith('http') || p.startsWith('/')) return p
  return 'file://' + p.replace(/\\/g, '/')
}

interface RenderCtx {
  fields: Record<string, string>
  logoPath?: string
  imagePaths?: string[]
  template: Template
}

function composeSocialSquare({ fields, logoPath, imagePaths, template }: RenderCtx): string {
  const bgColor = escape(fields.bgColor || '#1a1a2e')
  const accentColor = escape(fields.accentColor || '#e94560')
  const headline = escape(fields.headline || '')
  const subheadline = escape(fields.subheadline || '')
  const cta = escape(fields.cta || '')
  const logoUrl = logoPath ? toFileUrl(logoPath) : ''
  const imageUrl = imagePaths?.[0] ? toFileUrl(imagePaths[0]) : ''

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { overflow: hidden; background: ${bgColor}; font-family: 'Arial', sans-serif; }
    #stage {
      width: ${template.width}px;
      height: ${template.height}px;
      position: relative;
      overflow: hidden;
      background: ${bgColor};
    }
    .bg-image {
      position: absolute; inset: 0;
      background-image: ${imageUrl ? `url('${imageUrl}')` : 'none'};
      background-size: cover; background-position: center;
      opacity: 0.3;
    }
    .content {
      position: absolute; inset: 0;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      padding: 80px;
      text-align: center;
    }
    .logo-wrap {
      position: absolute; top: 60px; left: 60px;
      display: ${logoUrl ? 'block' : 'none'};
    }
    .logo-wrap img { height: 64px; object-fit: contain; }
    .accent-bar {
      width: 80px; height: 6px;
      background: ${accentColor};
      border-radius: 3px;
      margin-bottom: 40px;
    }
    .headline {
      font-size: 80px; font-weight: 900;
      color: #ffffff; line-height: 1.1;
      margin-bottom: 30px;
      text-transform: uppercase; letter-spacing: -2px;
    }
    .subheadline {
      font-size: 36px; color: rgba(255,255,255,0.75);
      line-height: 1.4; margin-bottom: 60px;
      max-width: 800px;
    }
    .cta {
      background: ${accentColor}; color: #fff;
      font-size: 32px; font-weight: 700;
      padding: 24px 60px; border-radius: 50px;
      letter-spacing: 1px; text-transform: uppercase;
    }
    .corner-accent {
      position: absolute; bottom: 0; right: 0;
      width: 300px; height: 300px;
      background: ${accentColor}; opacity: 0.15;
      clip-path: polygon(100% 0, 100% 100%, 0 100%);
    }
  </style>
</head>
<body>
<div id="stage"
  data-composition-id="${template.id}"
  data-width="${template.width}"
  data-height="${template.height}"
  data-duration="${template.duration}">

  <div class="bg-image" data-start="0" data-duration="${template.duration}" data-track-index="0"></div>

  ${logoUrl ? `<div class="logo-wrap" data-start="0.5" data-duration="${template.duration - 0.5}" data-track-index="2">
    <img src="${logoUrl}" alt="Logo" />
  </div>` : ''}

  <div class="corner-accent" data-start="0" data-duration="${template.duration}" data-track-index="1"></div>

  <div class="content" data-start="0.3" data-duration="${template.duration - 0.3}" data-track-index="3">
    <div class="accent-bar"></div>
    <div class="headline">${headline}</div>
    <div class="subheadline">${subheadline}</div>
    ${cta ? `<div class="cta">${cta}</div>` : ''}
  </div>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script>
  gsap.from('.accent-bar', { scaleX: 0, duration: 0.6, ease: 'power3.out', delay: 0.3 });
  gsap.from('.headline', { y: 60, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.5 });
  gsap.from('.subheadline', { y: 40, opacity: 0, duration: 0.8, ease: 'power2.out', delay: 0.8 });
  gsap.from('.cta', { scale: 0.8, opacity: 0, duration: 0.6, ease: 'back.out(1.7)', delay: 1.1 });
  gsap.from('.logo-wrap', { x: -30, opacity: 0, duration: 0.6, ease: 'power2.out', delay: 0.5 });
  gsap.from('.corner-accent', { scale: 0, opacity: 0, duration: 1, ease: 'power2.out', delay: 0 });
</script>
</body>
</html>`
}

function composeSocialStory({ fields, logoPath, imagePaths, template }: RenderCtx): string {
  const bgColor = escape(fields.bgColor || '#0f3460')
  const accentColor = escape(fields.accentColor || '#e94560')
  const headline = escape(fields.headline || '')
  const body = escape(fields.body || '')
  const cta = escape(fields.cta || '')
  const logoUrl = logoPath ? toFileUrl(logoPath) : ''
  const imageUrl = imagePaths?.[0] ? toFileUrl(imagePaths[0]) : ''

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { overflow: hidden; background: ${bgColor}; font-family: 'Arial', sans-serif; }
    #stage {
      width: ${template.width}px;
      height: ${template.height}px;
      position: relative;
      overflow: hidden;
      background: ${bgColor};
    }
    .bg-image {
      position: absolute; inset: 0;
      background-image: ${imageUrl ? `url('${imageUrl}')` : 'none'};
      background-size: cover; background-position: center;
      opacity: 0.25;
    }
    .top-bar {
      position: absolute; top: 0; left: 0; right: 0;
      height: 8px; background: ${accentColor};
    }
    .bottom-bar {
      position: absolute; bottom: 0; left: 0; right: 0;
      height: 8px; background: ${accentColor};
    }
    .logo-wrap {
      position: absolute; top: 80px; left: 0; right: 0;
      display: flex; justify-content: center;
      display: ${logoUrl ? 'flex' : 'none'};
    }
    .logo-wrap img { height: 80px; object-fit: contain; }
    .content {
      position: absolute; inset: 0;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      padding: 120px 80px;
      text-align: center;
    }
    .headline {
      font-size: 110px; font-weight: 900;
      color: #ffffff; line-height: 1.05;
      margin-bottom: 50px;
      text-transform: uppercase;
    }
    .divider {
      width: 100px; height: 6px;
      background: ${accentColor};
      border-radius: 3px;
      margin-bottom: 50px;
    }
    .body {
      font-size: 46px; color: rgba(255,255,255,0.8);
      line-height: 1.5; margin-bottom: 80px;
    }
    .cta {
      background: ${accentColor}; color: #fff;
      font-size: 42px; font-weight: 700;
      padding: 30px 80px; border-radius: 60px;
      letter-spacing: 1px; text-transform: uppercase;
    }
    .circle-deco {
      position: absolute; top: -200px; right: -200px;
      width: 700px; height: 700px;
      border-radius: 50%;
      background: ${accentColor}; opacity: 0.08;
    }
    .circle-deco2 {
      position: absolute; bottom: -150px; left: -150px;
      width: 500px; height: 500px;
      border-radius: 50%;
      background: ${accentColor}; opacity: 0.08;
    }
  </style>
</head>
<body>
<div id="stage"
  data-composition-id="${template.id}"
  data-width="${template.width}"
  data-height="${template.height}"
  data-duration="${template.duration}">

  <div class="bg-image" data-start="0" data-duration="${template.duration}" data-track-index="0"></div>
  <div class="circle-deco" data-start="0" data-duration="${template.duration}" data-track-index="0"></div>
  <div class="circle-deco2" data-start="0" data-duration="${template.duration}" data-track-index="0"></div>
  <div class="top-bar" data-start="0" data-duration="${template.duration}" data-track-index="1"></div>
  <div class="bottom-bar" data-start="0" data-duration="${template.duration}" data-track-index="1"></div>

  ${logoUrl ? `<div class="logo-wrap" data-start="0.5" data-duration="${template.duration - 0.5}" data-track-index="2">
    <img src="${logoUrl}" alt="Logo" />
  </div>` : ''}

  <div class="content" data-start="0.2" data-duration="${template.duration - 0.2}" data-track-index="3">
    <div class="headline">${headline}</div>
    <div class="divider"></div>
    ${body ? `<div class="body">${body}</div>` : ''}
    ${cta ? `<div class="cta">${cta}</div>` : ''}
  </div>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script>
  gsap.from('.top-bar', { scaleX: 0, duration: 0.5, ease: 'power2.out', transformOrigin: 'left' });
  gsap.from('.bottom-bar', { scaleX: 0, duration: 0.5, ease: 'power2.out', transformOrigin: 'right' });
  gsap.from('.headline', { y: -80, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 0.4 });
  gsap.from('.divider', { scaleX: 0, duration: 0.5, ease: 'power2.out', delay: 0.9 });
  gsap.from('.body', { y: 50, opacity: 0, duration: 0.8, ease: 'power2.out', delay: 1.1 });
  gsap.from('.cta', { scale: 0.7, opacity: 0, duration: 0.6, ease: 'back.out(1.7)', delay: 1.5 });
  gsap.from('.logo-wrap', { y: -20, opacity: 0, duration: 0.6, ease: 'power2.out', delay: 0.5 });
</script>
</body>
</html>`
}

function composeSocialLandscape({ fields, logoPath, imagePaths, template }: RenderCtx): string {
  const bgColor = escape(fields.bgColor || '#16213e')
  const accentColor = escape(fields.accentColor || '#0f3460')
  const headline = escape(fields.headline || '')
  const subheadline = escape(fields.subheadline || '')
  const author = escape(fields.author || '')
  const logoUrl = logoPath ? toFileUrl(logoPath) : ''
  const imageUrl = imagePaths?.[0] ? toFileUrl(imagePaths[0]) : ''

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { overflow: hidden; background: ${bgColor}; font-family: 'Arial', sans-serif; }
    #stage {
      width: ${template.width}px;
      height: ${template.height}px;
      position: relative;
      overflow: hidden;
      background: ${bgColor};
    }
    .bg-image {
      position: absolute; top: 0; right: 0;
      width: 55%; height: 100%;
      background-image: ${imageUrl ? `url('${imageUrl}')` : 'none'};
      background-size: cover; background-position: center;
      opacity: 0.4;
    }
    .bg-gradient {
      position: absolute; inset: 0;
      background: linear-gradient(to right, ${bgColor} 40%, transparent 70%);
    }
    .left-panel {
      position: absolute; top: 0; left: 0;
      width: 55%; height: 100%;
      display: flex; flex-direction: column;
      justify-content: center;
      padding: 80px 100px;
    }
    .logo-wrap {
      display: ${logoUrl ? 'block' : 'none'};
      margin-bottom: 60px;
    }
    .logo-wrap img { height: 56px; object-fit: contain; }
    .accent-line {
      width: 80px; height: 5px;
      background: ${accentColor};
      border-radius: 3px;
      margin-bottom: 40px;
    }
    .headline {
      font-size: 80px; font-weight: 900;
      color: #ffffff; line-height: 1.1;
      margin-bottom: 30px;
      letter-spacing: -2px;
    }
    .subheadline {
      font-size: 36px; color: rgba(255,255,255,0.7);
      line-height: 1.5; margin-bottom: 60px;
    }
    .author-row {
      display: flex; align-items: center; gap: 20px;
    }
    .author-dot {
      width: 12px; height: 12px;
      background: ${accentColor}; border-radius: 50%;
    }
    .author {
      font-size: 30px; color: rgba(255,255,255,0.6);
      font-weight: 600; text-transform: uppercase;
      letter-spacing: 2px;
    }
    .side-deco {
      position: absolute; right: 0; top: 0;
      width: 8px; height: 100%;
      background: ${accentColor};
    }
  </style>
</head>
<body>
<div id="stage"
  data-composition-id="${template.id}"
  data-width="${template.width}"
  data-height="${template.height}"
  data-duration="${template.duration}">

  <div class="bg-image" data-start="0" data-duration="${template.duration}" data-track-index="0"></div>
  <div class="bg-gradient" data-start="0" data-duration="${template.duration}" data-track-index="1"></div>
  <div class="side-deco" data-start="0" data-duration="${template.duration}" data-track-index="2"></div>

  <div class="left-panel" data-start="0.2" data-duration="${template.duration - 0.2}" data-track-index="3">
    ${logoUrl ? `<div class="logo-wrap">
      <img src="${logoUrl}" alt="Logo" />
    </div>` : ''}
    <div class="accent-line"></div>
    <div class="headline">${headline}</div>
    ${subheadline ? `<div class="subheadline">${subheadline}</div>` : ''}
    ${author ? `<div class="author-row">
      <div class="author-dot"></div>
      <div class="author">${author}</div>
    </div>` : ''}
  </div>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script>
  gsap.from('.side-deco', { scaleY: 0, duration: 0.8, ease: 'power3.out', transformOrigin: 'top' });
  gsap.from('.accent-line', { scaleX: 0, duration: 0.5, ease: 'power2.out', delay: 0.3 });
  gsap.from('.logo-wrap', { x: -40, opacity: 0, duration: 0.6, ease: 'power2.out', delay: 0.3 });
  gsap.from('.headline', { x: -60, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.5 });
  gsap.from('.subheadline', { x: -40, opacity: 0, duration: 0.7, ease: 'power2.out', delay: 0.8 });
  gsap.from('.author-row', { x: -30, opacity: 0, duration: 0.6, ease: 'power2.out', delay: 1.1 });
  gsap.from('.bg-image', { scale: 1.05, duration: 2, ease: 'power1.out' });
</script>
</body>
</html>`
}
