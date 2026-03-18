'use client'
import React, { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useCategories } from '@/lib/hooks/useCategories'
import { useToast } from '@/components/ui/ToastProvider'
import type { Category } from '@/lib/types'

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  categoryToEdit?: Category
}

const COLORS = ['#7C3AED', '#EC4899', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6']

export const CategoryModal = ({ isOpen, onClose, categoryToEdit }: CategoryModalProps) => {
  const [name, setName] = useState('')
  const [color, setColor] = useState(COLORS[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { createCategory, updateCategory } = useCategories()
  const toast = useToast()

  useEffect(() => {
    if (isOpen) {
      if (categoryToEdit) {
        setName(categoryToEdit.name)
        setColor(categoryToEdit.color)
      } else {
        setName('')
        setColor(COLORS[Math.floor(Math.random() * COLORS.length)])
      }
      setError('')
    }
  }, [isOpen, categoryToEdit])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    setError('')

    try {
      if (categoryToEdit) {
        const res = await updateCategory(categoryToEdit.id, { name: name.trim(), color })
        if (res.error) throw new Error(res.error)
        toast.success(`Category "${name}" updated`)
      } else {
        const res = await createCategory({ name: name.trim(), color })
        if (res.errors) throw new Error(res.errors[0].message)
        toast.success(`Category "${name}" created`)
      }
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={categoryToEdit ? 'Edit Category' : 'New Category'}
      preventClose={loading || name.length > 0}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading || !name.trim()} isLoading={loading}>
            {categoryToEdit ? 'Save Changes' : 'Create Category'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSave} className="flex flex-col gap-5 py-2">
        <Input
          label="Category Name"
          placeholder="e.g. Work, Personal, Groceries"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setError('')
          }}
          maxLength={50}
          autoFocus
          required
        />
        
        {error && (
          <p className="text-sm font-medium text-danger flex items-center gap-1 mt-1">
            <span aria-hidden="true">⚠</span> {error}
          </p>
        )}

        <div>
          <label className="text-sm font-medium text-text-1 mb-2 block">Color</label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map(c => (
              <button
                key={c}
                type="button"
                className={`w-8 h-8 rounded-full shadow-sm ring-offset-2 ring-offset-bg-surface transition-all ${
                  color === c ? 'ring-2 ring-accent scale-110' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
                aria-label={`Select color ${c}`}
                aria-pressed={color === c}
              />
            ))}
          </div>
        </div>
      </form>
    </Modal>
  )
}
