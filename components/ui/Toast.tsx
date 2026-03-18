'use client'
import React from 'react'
import type { ToastOptions } from '@/lib/types'

export interface ToastItem extends ToastOptions {
  id: string
}

interface ToastProps {
  toast: ToastItem
  onRemove: (id: string) => void
}

export const Toast = ({ toast, onRemove }: ToastProps) => {
  return (
    <div
      className={`toast toast-${toast.type}`}
      role={toast.type === 'error' ? 'alert' : 'status'}
      aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
    >
      <span className={`toast-icon toast-icon-${toast.type}`} aria-hidden="true">
        {toast.type === 'success' ? '✓' :
         toast.type === 'error'   ? '✕' :
         toast.type === 'warning' ? '⚠' : 'ℹ'}
      </span>
      <span className="toast-message">{toast.message}</span>
      {toast.undoCallback && (
        <button
          className="toast-undo"
          onClick={() => {
            toast.undoCallback?.()
            onRemove(toast.id)
          }}
          aria-label="Undo last action"
        >
          Undo
        </button>
      )}
      <button
        className="toast-close ml-2 text-white/70 hover:text-white"
        onClick={() => onRemove(toast.id)}
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </div>
  )
}

interface ToastProviderProps {
  toasts: ToastItem[]
  onRemove: (id: string) => void
}

export const ToastContainer = ({ toasts, onRemove }: ToastProviderProps) => {
  return (
    <div
      className="toast-container"
      aria-label="Notifications"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map(t => (
        <Toast key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  )
}
