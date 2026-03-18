'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { validatePassword } from '@/lib/utils/validation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { PasswordStrength } from '@/components/auth/PasswordStrength'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  const [generalError, setGeneralError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()
  
  const { strength, errors: pwErrors } = validatePassword(password)
  const isValid = pwErrors.length === 0 && password === confirmPassword

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setGeneralError('')

    if (password !== confirmPassword) {
      setGeneralError('Passwords do not match.')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.updateUser({ password })
    
    if (error) {
      setGeneralError(error.message)
    } else {
      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
        router.refresh()
      }, 3000)
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-bg-app py-12" aria-label="Reset Password page">
      <div className="mb-8 text-center text-accent">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto border-2 border-accent p-2 rounded-xl" aria-hidden="true">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      </div>
      
      <div className="w-full max-w-md mx-auto p-8 rounded-2xl bg-bg-surface border border-border shadow-lg">
        {success ? (
          <div className="text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-success-light text-success rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">✓</div>
            <h1 className="text-2xl font-bold text-text-1 mb-2">Password Updated!</h1>
            <p className="text-text-2 mb-6">Redirecting you to the dashboard...</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-text-1 mb-2">Create new password</h1>
              <p className="text-text-2">Please enter your new password below.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="relative">
                <Input 
                  label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-text-3 hover:text-text-1 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
                
                {password.length > 0 && <PasswordStrength strength={strength} errors={pwErrors} />}
              </div>

              <Input 
                label="Confirm New Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              
              {generalError && (
                <div className="p-3 rounded-lg bg-danger-light text-danger text-sm font-medium flex items-start gap-2" role="alert" aria-live="assertive">
                  <span aria-hidden="true" className="mt-0.5">⚠</span>
                  <span>{generalError}</span>
                </div>
              )}

              <Button type="submit" isLoading={loading} disabled={!isValid}>
                Update Password
              </Button>
            </form>
          </>
        )}
      </div>
    </main>
  )
}
