import React from 'react'
import { cn } from '@/lib/utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id || generatedId
    const errorId = `${inputId}-error`
    const helperId = `${inputId}-helper`

    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text-1">
            {label} {props.required && <span className="text-danger">(required)</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'form-input',
            error ? 'input-error' : '',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          {...props}
        />
        {error && (
          <p id={errorId} className="field-error visible" aria-live="polite">
            <span aria-hidden="true">✕</span> {error}
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="text-sm text-text-2 mt-1">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'
