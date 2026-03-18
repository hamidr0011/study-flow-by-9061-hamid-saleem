'use client'
import { useState, useEffect, useCallback } from 'react'
import type { Task } from '@/lib/types'

export function useTasks() {
  const [tasks,   setTasks]   = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)
  
  const fetchTasks = useCallback(async (params?: {
    category?: string
    search?:   string
    completed?: boolean
  }) => {
    setLoading(true)
    setError(null)
    try {
      const qs = new URLSearchParams()
      if (params?.category)  qs.set('category', params.category)
      if (params?.search)    qs.set('search',   params.search)
      if (params?.completed !== undefined) 
        qs.set('completed', String(params.completed))
      
      const res  = await fetch(`/api/tasks?${qs}`)
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || 'Failed to load tasks')
      setTasks(data.tasks)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])
  
  const createTask = useCallback(async (
    taskData: Partial<Task>
  ): Promise<{ task?: Task; errors?: { field: string; message: string }[] }> => {
    const res  = await fetch('/api/tasks', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(taskData)
    })
    const data = await res.json()
    if (!res.ok) return { errors: data.errors || [{ field: 'general', message: data.error }] }
    setTasks(prev => [data.task, ...prev])
    return { task: data.task }
  }, [])
  
  const updateTask = useCallback(async (
    id: string, updates: Partial<Task>
  ): Promise<{ task?: Task; error?: string }> => {
    // Optimistic update
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, ...updates } as Task : t
    ))
    
    const res  = await fetch(`/api/tasks/${id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(updates)
    })
    const data = await res.json()
    
    if (!res.ok) {
      // Revert on failure by refetching
      fetchTasks()
      return { error: data.error }
    }
    
    setTasks(prev => prev.map(t => t.id === id ? data.task : t))
    return { task: data.task }
  }, [fetchTasks])
  
  const deleteTask = useCallback(async (id: string) => {
    // Optimistic removal
    setTasks(prev => prev.filter(t => t.id !== id))
    
    const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      fetchTasks()
    }
    
    return async () => {
      await fetch(`/api/tasks/${id}`, { method: 'PUT' })
      fetchTasks()
    }
  }, [fetchTasks])
  
  const toggleTask = useCallback(async (id: string) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    return updateTask(id, { completed: !task.completed })
  }, [tasks, updateTask])
  
  useEffect(() => { fetchTasks() }, [fetchTasks])
  
  return { 
    tasks, loading, error, 
    fetchTasks, createTask, updateTask, deleteTask, toggleTask 
  }
}
