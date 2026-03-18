'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { validateEmail, validatePassword } from '@/lib/utils/validation'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { PasswordStrength } from './PasswordStrength'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

export const RegisterForm = () => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const [emailError, setEmailError] = useState('')
  const [generalError, setGeneralError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  const { strength, errors: pwErrors } = validatePassword(password)
  const isValid = email.includes('@') && pwErrors.length === 0 && password === confirmPassword && agreeTerms

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setGeneralError('')
    
    const err = validateEmail(email)
    if (err) {
      setEmailError(err)
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setGeneralError('Passwords do not match.')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    })
    
    if (error) {
      setGeneralError(error.message)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
  }

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto p-8 rounded-2xl bg-bg-surface border border-border shadow-lg text-center animate-in zoom-in duration-300">
        <div className="w-16 h-16 bg-success-light text-success rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
          ✓
        </div>
        <h2 className="text-2xl font-bold text-text-1 mb-2">Check your email!</h2>
        <p className="text-text-2 mb-6">We sent a verification link to {email}</p>
        <Button variant="secondary" onClick={() => window.location.reload()} className="w-full">
          Start over
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-2xl bg-bg-surface border border-border shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-text-1 mb-2">Create your account</h1>
        <p className="text-text-2">Free forever. No credit card required.</p>
      </div>

      <Button variant="secondary" className="w-full mb-6 relative" onClick={handleGoogleLogin}>
        <svg className="w-5 h-5 absolute left-4" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </Button>

      <div className="flex items-center gap-3 mb-6">
        <div className="h-px bg-border flex-1" />
        <span className="text-sm text-text-3 font-medium">OR</span>
        <div className="h-px bg-border flex-1" />
      </div>

      <form onSubmit={handleRegister} className="flex flex-col gap-5">
        <Input 
          label="Full Name"
          autoComplete="name"
          placeholder="Jane Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        
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
        
        <div className="relative">
          <Input 
            label="Password"
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
          label="Confirm Password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <label className="flex items-start gap-3 mt-2 cursor-pointer group">
          <div className="mt-1 relative flex items-center justify-center">
            <input 
              type="checkbox" 
              className="peer sr-only"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            />
            <div className="w-5 h-5 border-2 border-border-strong rounded-md peer-checked:bg-accent peer-checked:border-accent peer-focus-visible:ring-2 ring-accent ring-offset-2 ring-offset-bg-surface transition-colors"></div>
            <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-sm text-text-2 group-hover:text-text-1 transition-colors leading-tight">
            I agree to the <a href="#" className="text-accent hover:underline">Terms of Service</a> and <a href="#" className="text-accent hover:underline">Privacy Policy</a>
          </span>
        </label>

        {generalError && (
          <div className="p-3 rounded-lg bg-danger-light text-danger text-sm font-medium flex items-start gap-2" role="alert" aria-live="assertive">
            <span aria-hidden="true" className="mt-0.5">⚠</span>
            <span>{generalError}</span>
          </div>
        )}

        <Button type="submit" isLoading={loading} disabled={!isValid}>
          Create Account
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-text-2">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-accent hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  )
}
