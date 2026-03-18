import { RegisterForm } from '@/components/auth/RegisterForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Register - Study Flow',
  description: 'Create a new Study Flow account',
}

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-bg-app py-12" aria-label="Registration page">
      <div className="mb-8 text-center">
        <div className="w-12 h-12 bg-accent rounded-xl mx-auto flex items-center justify-center mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 11 12 14 22 4"></polyline>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
          </svg>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-text-1">Study Flow</h1>
        <p className="text-text-2 mt-1">Organize your tasks, your way.</p>
      </div>
      
      <RegisterForm />
    </main>
  )
}
