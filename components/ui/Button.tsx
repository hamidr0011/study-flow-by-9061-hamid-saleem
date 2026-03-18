import React from 'react'
import { cn } from '@/lib/utils/cn'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  isLoading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={cn(
          `btn-${variant}`,
          isLoading && 'opacity-70 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="animate-spin inline-block mr-2 border-2 border-current border-t-transparent rounded-full w-4 h-4" aria-hidden="true" />
        ) : null}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
