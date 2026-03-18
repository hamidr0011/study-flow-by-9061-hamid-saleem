import React from 'react'

interface PasswordStrengthProps {
  strength: 'weak' | 'fair' | 'strong' | 'very-strong'
  errors: string[]
}

export const PasswordStrength = ({ strength, errors }: PasswordStrengthProps) => {
  const reqs = [
    { label: 'At least 8 characters',        done: !errors.includes('At least 8 characters') },
    { label: 'One uppercase letter',         done: !errors.includes('At least one uppercase letter') },
    { label: 'One lowercase letter',         done: !errors.includes('At least one lowercase letter') },
    { label: 'One number',                   done: !errors.includes('At least one number') },
    { label: 'One special character (!@#$)', done: !errors.includes('At least one special character (!@#$...)') }
  ]

  return (
    <div className="w-full mt-2" aria-live="polite">
      <div className="strength-bar" role="progressbar" aria-valuenow={
        strength === 'weak' ? 25 : strength === 'fair' ? 50 : strength === 'strong' ? 75 : 100
      } aria-valuemin={0} aria-valuemax={100} aria-label={`Password strength: ${strength}`}>
        <div className={`strength-fill strength-${strength}`} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-3">
        {reqs.map((req, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span aria-hidden="true" className={req.done ? 'text-success' : 'text-text-3'}>
              {req.done ? '✓' : '○'}
            </span>
            <span className={req.done ? 'text-text-1' : 'text-text-2'}>{req.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
