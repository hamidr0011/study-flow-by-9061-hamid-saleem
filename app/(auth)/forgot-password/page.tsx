'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { validateEmail } from '@/lib/utils/validation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [generalError, setGeneralError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setGeneralError('')
    
    const err = validateEmail(email)
    if (err) {
      setEmailError(err)
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    
    if (error) {
      setGeneralError(error.message)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-bg-app py-12" aria-label="Forgot Password page">
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
            <h1 className="text-2xl font-bold text-text-1 mb-2">Check your email</h1>
            <p className="text-text-2 mb-6">We&apos;ve sent a password reset link to {email}.</p>
            <Link href="/login" className="btn-secondary w-full">Back to login</Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-text-1 mb-2">Reset your password</h1>
              <p className="text-text-2">Enter your email and we&apos;ll send you a reset link.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Input 
                label="Email address"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setEmailError('')
                }}
                error={emailError}
              />
              
              {generalError && (
                <div className="p-3 rounded-lg bg-danger-light text-danger text-sm font-medium flex items-start gap-2" role="alert" aria-live="assertive">
                  <span aria-hidden="true" className="mt-0.5">⚠</span>
                  <span>{generalError}</span>
                </div>
              )}

              <Button type="submit" isLoading={loading} disabled={!email}>
                Send Reset Link
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-text-2">
              <Link href="/login" className="font-medium text-accent hover:underline">
                Back to sign in
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
