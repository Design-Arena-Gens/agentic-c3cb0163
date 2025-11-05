import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Control Center - Unified Knowledge Base',
  description: 'Connect all your AI providers to a singular knowledge base',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
