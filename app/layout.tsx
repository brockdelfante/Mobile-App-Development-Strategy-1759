import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Social Video Generator',
  description: 'Internal tool for generating social videos with HyperFrames',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
