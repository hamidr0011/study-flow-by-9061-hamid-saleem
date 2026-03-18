import React from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { SkipLink } from '@/components/layout/SkipLink'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell flex h-screen w-full">
      <SkipLink />
      <Sidebar />
      <div className="main-wrapper flex flex-col flex-1 min-w-0">
        <Topbar />
        <main id="main-content" tabIndex={-1} className="flex-1 overflow-y-auto outline-none p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
