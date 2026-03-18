import type { Metadata } from 'next'
import { ToastProvider } from '@/components/ui/ToastProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Study Flow',
  description: 'Organize your tasks, your way.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="antialiased">
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
