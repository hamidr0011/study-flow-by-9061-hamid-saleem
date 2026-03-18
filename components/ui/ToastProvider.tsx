'use client'
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { ToastContainer, type ToastItem } from './Toast'
import type { ToastOptions } from '@/lib/types'

interface ToastContextType {
  success: (message: string, options?: Partial<ToastOptions>) => void
  error:   (message: string, options?: Partial<ToastOptions>) => void
  warning: (message: string, options?: Partial<ToastOptions>) => void
  info:    (message: string, options?: Partial<ToastOptions>) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const addToast = useCallback((options: ToastOptions) => {
    const id = uuidv4()
    setToasts((prev) => [...prev, { ...options, id }])

    const duration = options.duration || 4000
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const contextValue = {
    success: (message: string, options?: Partial<ToastOptions>) => addToast({ type: 'success', message, ...options }),
    error:   (message: string, options?: Partial<ToastOptions>) => addToast({ type: 'error', message, ...options }),
    warning: (message: string, options?: Partial<ToastOptions>) => addToast({ type: 'warning', message, ...options }),
    info:    (message: string, options?: Partial<ToastOptions>) => addToast({ type: 'info', message, ...options }),
  }

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}
