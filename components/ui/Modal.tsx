'use client'
import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils/cn'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  preventClose?: boolean
}

export function Modal({ isOpen, onClose, title, children, footer, preventClose }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !preventClose) {
        onClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
      // focus trap focus first input
      setTimeout(() => {
        const firstInput = modalRef.current?.querySelector('input, textarea, button') as HTMLElement
        firstInput?.focus()
      }, 50)
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose, preventClose])

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        ref={modalRef}
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="modal-title"
        className="bg-bg-surface w-full max-w-md rounded-xl shadow-xl border border-border flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 id="modal-title" className="text-lg font-semibold text-text-1">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-text-2 hover:bg-bg-elevated hover:text-text-1 transition-colors"
            aria-label="Close dialog"
          >
            <span aria-hidden="true" className="text-xl leading-none">×</span>
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto">
          {children}
        </div>
        
        {footer && (
          <div className="p-4 border-t border-border flex justify-end gap-3 bg-bg-elevated rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
