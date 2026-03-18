'use client'
import { useState, useEffect, useCallback } from 'react'
import type { Category } from '@/lib/types'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || 'Failed to load categories')
      setCategories(data.categories)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  const createCategory = useCallback(async (categoryData: Partial<Category>) => {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryData)
    })
    const data = await res.json()
    if (!res.ok) return { errors: data.errors || [{ field: 'general', message: data.error }] }
    setCategories(prev => [...prev, data.category])
    return { category: data.category }
  }, [])

  const updateCategory = useCallback(async (id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } as Category : c))
    
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    const data = await res.json()
    
    if (!res.ok) {
      fetchCategories()
      return { error: data.error }
    }
    
    setCategories(prev => prev.map(c => c.id === id ? data.category : c))
    return { category: data.category }
  }, [fetchCategories])

  const deleteCategory = useCallback(async (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id))
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      fetchCategories()
    }
  }, [fetchCategories])

  useEffect(() => { fetchCategories() }, [fetchCategories])

  return { categories, loading, error, fetchCategories, createCategory, updateCategory, deleteCategory }
}
