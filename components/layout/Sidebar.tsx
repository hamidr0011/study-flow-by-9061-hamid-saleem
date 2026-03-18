'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useTasks } from '@/lib/hooks/useTasks'
import { useCategories } from '@/lib/hooks/useCategories'
import { createClient } from '@/lib/supabase/client'
import { HomeIcon, CheckIcon, BarChart2Icon as ChartIcon, SettingsIcon as GearIcon, LogOutIcon as SignOutIcon, MoonIcon, SunIcon } from 'lucide-react'
import type { Profile } from '@/lib/types'

export const Sidebar = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { categories, loading: catsLoading } = useCategories()
  const { tasks } = useTasks()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [email, setEmail] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const supabase = createClient()
  
  const pendingCount = tasks.filter(t => !t.completed).length

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setEmail(user.email || '')
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        if (data) {
          setProfile(data)
          setDarkMode(data.dark_mode)
          if (data.dark_mode) document.documentElement.classList.add('dark')
        }
      }
    }
    loadUser()
  }, [supabase])

  const toggleDarkMode = async () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    if (newMode) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
    
    if (profile) {
      await supabase.from('profiles').update({ dark_mode: newMode }).eq('id', profile.id)
    }
  }

  const handleSignOut = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      await supabase.auth.signOut()
      router.push('/login')
    }
  }

  const openCategoryModal = () => {
    // We'll implement this functionality later when we have CategoryModal
    window.alert('Category modal to be implemented')
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard',  icon: HomeIcon, shortcut: 'D' },
    { href: '/tasks',     label: 'Tasks',      icon: CheckIcon, shortcut: 'T', badge: pendingCount > 0 ? pendingCount : undefined },
    { href: '/progress',  label: 'Progress',   icon: ChartIcon, shortcut: 'P' },
    { href: '/settings',  label: 'Settings',   icon: GearIcon, shortcut: 'S' },
  ]

  const getInitials = (name: string) => name.substring(0, 2).toUpperCase()

  return (
    <aside className="sidebar" role="navigation" aria-label="Main navigation">
      <div className="p-4 border-b border-border flex items-center gap-3 bg-bg-surface sticky top-0 z-10">
        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shrink-0" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 11 12 14 22 4"></polyline>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
          </svg>
        </div>
        <span className="text-lg font-bold text-text-1 tracking-tight">Study Flow</span>
      </div>
      
      <nav className="p-3 flex flex-col gap-1">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-link rounded-lg ${pathname === item.href ? 'active' : ''}`}
            aria-current={pathname === item.href ? 'page' : undefined}
            title={`${item.label} (Keyboard: ${item.shortcut})`}
          >
            <item.icon size={18} aria-hidden="true" className={pathname === item.href ? 'text-accent' : 'text-text-3'} />
            <span className="flex-1 font-medium">{item.label}</span>
            {item.badge !== undefined && (
              <span className="bg-accent text-white text-[11px] font-bold px-2 py-0.5 rounded-full" aria-label={`${item.badge} pending tasks`}>
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>
      
      <div className="px-4 py-3 mt-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-text-3 uppercase tracking-wider">Categories</span>
          <button 
            onClick={openCategoryModal}
            className="w-5 h-5 flex items-center justify-center rounded bg-bg-elevated text-text-2 hover:bg-border-strong hover:text-text-1 transition-colors"
            aria-label="Create new category"
            title="Add category"
          >
            +
          </button>
        </div>
        
        {catsLoading ? (
          <div className="flex flex-col gap-2">
            {[1,2,3].map(i => <div key={i} className="skeleton h-8 w-full rounded-md" />)}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-sm border border-dashed border-border rounded-lg p-3 text-center bg-bg-elevated/50">
            <p className="text-text-2 mb-2 text-xs">No categories yet.</p>
            <button className="text-accent text-xs font-semibold hover:underline" onClick={openCategoryModal}>
              Create one
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={`/tasks?category=${cat.id}`}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm hover:bg-bg-elevated ${
                  searchParams.get('category') === cat.id ? 'bg-bg-elevated text-text-1 font-medium' : 'text-text-2'
                }`}
                aria-label={`${cat.name} category`}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} aria-hidden="true" />
                <span className="flex-1 truncate">{cat.name}</span>
                <span className="text-xs font-medium bg-bg-sunken px-1.5 py-0.5 rounded text-text-3" aria-hidden="true">
                  {tasks.filter(t => t.category_id === cat.id && !t.completed).length}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-auto p-4 border-t border-border bg-bg-surface flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
          <div className="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-sm" aria-hidden="true">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              getInitials(profile?.full_name || email)
            )}
          </div>
          <span className="text-sm font-medium text-text-1 truncate">
            {profile?.full_name || email.split('@')[0]}
          </span>
        </div>
        
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={toggleDarkMode}
            className="w-8 h-8 flex items-center justify-center rounded-md text-text-3 hover:text-text-1 hover:bg-bg-elevated transition-colors"
            aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
            aria-pressed={darkMode}
            title="Toggle dark mode"
          >
            {darkMode ? <SunIcon size={16} /> : <MoonIcon size={16} />}
          </button>
          <button
            onClick={handleSignOut}
            className="w-8 h-8 flex items-center justify-center rounded-md text-text-3 hover:text-danger hover:bg-danger-light transition-colors"
            aria-label="Sign out"
            title="Sign out"
          >
            <SignOutIcon size={16} />
          </button>
        </div>
      </div>
    </aside>
  )
}
