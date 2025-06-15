import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hospital Data Cleaning Showcase',
  description: 'A showcase of AI-powered hospital data cleaning functionality',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  )
} 