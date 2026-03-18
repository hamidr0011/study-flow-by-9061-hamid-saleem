'use client'
import React from 'react'
import { BellIcon, SearchIcon, HelpCircleIcon } from 'lucide-react'
import { getGreeting } from '@/lib/utils/dates'
import { usePathname } from 'next/navigation'

export const Topbar = () => {
  const pathname = usePathname()

  const getPageTitle = () => {
    switch(pathname) {
      case '/dashboard': return getGreeting()
      case '/tasks': return 'All Tasks'
      case '/progress': return 'Your Progress'
      case '/settings': return 'Settings'
      default: return getGreeting()
    }
  }

  return (
    <header className="h-16 border-b border-border bg-bg-surface flex items-center justify-between px-6 shrink-0 z-10 sticky top-0">
      <h2 className="text-xl font-bold text-text-1">
        {getPageTitle()}
      </h2>
      
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block w-64">
          <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3 pointer-events-none" />
          <input 
            type="text" 
            placeholder="Search tasks... (Press '/')"
            className="w-full bg-bg-sunken border border-border text-sm rounded-full pl-9 pr-4 py-2 text-text-1 placeholder-text-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
            aria-label="Search tasks"
          />
        </div>

        <button 
          className="w-9 h-9 flex items-center justify-center rounded-full text-text-2 hover:bg-bg-elevated hover:text-text-1 transition-colors"
          aria-label="Help and shortcuts"
          title="Keyboard shortcuts (?)"
        >
          <HelpCircleIcon size={20} />
        </button>

        <button 
          className="relative w-9 h-9 flex items-center justify-center rounded-full text-text-2 hover:bg-bg-elevated hover:text-text-1 transition-colors"
          aria-label="Notifications"
        >
          <BellIcon size={20} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-accent rounded-full border-2 border-bg-surface" />
        </button>
      </div>
    </header>
  )
}
