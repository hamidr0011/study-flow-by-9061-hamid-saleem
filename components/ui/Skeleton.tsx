import React from 'react'
import { cn } from '@/lib/utils/cn'

export const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn('skeleton', className)}
      aria-hidden="true"
      {...props}
    />
  )
}

export const EmptyState = ({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-border bg-bg-elevated/50">
      {icon && <div className="text-text-3 mb-4">{icon}</div>}
      <h3 className="text-lg font-medium text-text-1 mb-2">{title}</h3>
      {description && <p className="text-sm text-text-2 mb-6 max-w-sm">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  )
}

export const ProgressBar = ({ value, max = 100, label }: { value: number; max?: number; label?: string }) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  
  return (
    <div className="w-full">
      {label && <div className="text-xs font-medium text-text-2 mb-1">{label}</div>}
      <div 
        role="progressbar" 
        className="h-2 w-full bg-bg-sunken rounded-full overflow-hidden"
        aria-valuenow={Math.round(percentage)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div 
          className="h-full bg-accent transition-all duration-300 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
