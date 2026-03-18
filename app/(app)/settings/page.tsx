'use client'
import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/ToastProvider'
import type { Profile } from '@/lib/types'

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()
  const toast = useToast()

  const [fullName, setFullName] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [defaultView, setDefaultView] = useState<'list' | 'board'>('list')
  const [showCompleted, setShowCompleted] = useState(true)

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        if (data) {
          setProfile(data)
          setFullName(data.full_name || '')
          setDarkMode(data.dark_mode)
          setDefaultView(data.default_view)
          setShowCompleted(data.show_completed)
        }
      }
      setLoading(false)
    }
    fetchProfile()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    setSaving(true)
    
    // Optimistically update document root
    if (darkMode) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')

    const { error } = await supabase.from('profiles').update({
      full_name: fullName.trim(),
      dark_mode: darkMode,
      default_view: defaultView,
      show_completed: showCompleted
    }).eq('id', profile.id)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Settings saved successfully.')
    }
    setSaving(false)
  }

  if (loading) return null

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto pb-12 animate-in fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-1">Settings</h1>
        <p className="text-text-2 mt-1">Manage your account preferences and application settings.</p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-8 bg-bg-surface border border-border p-6 sm:p-8 rounded-2xl shadow-sm">
        
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-text-1 border-b border-border pb-2">Profile Information</h2>
          <div className="flex flex-col gap-2 max-w-md">
            <label className="text-sm font-medium text-text-1">Full Name</label>
            <input 
              type="text" 
              className="form-input" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
            />
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-text-1 border-b border-border pb-2">Preferences</h2>
          
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="font-medium text-text-1">Dark Mode</div>
              <div className="text-sm text-text-2">Use darker colors for the app interface.</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={darkMode} onChange={e => setDarkMode(e.target.checked)} />
              <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <div className="font-medium text-text-1">Show Completed Tasks</div>
              <div className="text-sm text-text-2">Display completed tasks in lists by default.</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={showCompleted} onChange={e => setShowCompleted(e.target.checked)} />
              <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>

          <div className="flex flex-col gap-2 max-w-sm mt-2">
            <label className="text-sm font-medium text-text-1">Default Task View</label>
            <div className="flex p-1 bg-bg-sunken rounded-lg border border-border">
              <button
                type="button"
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${defaultView === 'list' ? 'bg-bg-surface shadow-sm text-text-1' : 'text-text-3 hover:text-text-2'}`}
                onClick={() => setDefaultView('list')}
              >
                List View
              </button>
              <button
                type="button"
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${defaultView === 'board' ? 'bg-bg-surface shadow-sm text-text-1' : 'text-text-3 hover:text-text-2'}`}
                onClick={() => setDefaultView('board')}
              >
                Board View
              </button>
            </div>
          </div>
        </section>

        <div className="pt-4 mt-2 border-t border-border flex justify-end">
          <Button type="submit" isLoading={saving}>
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  )
}
