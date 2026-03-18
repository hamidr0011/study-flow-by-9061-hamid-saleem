'use client'
import React, { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useCategories } from '@/lib/hooks/useCategories'
import { useTasks } from '@/lib/hooks/useTasks'
import { useToast } from '@/components/ui/ToastProvider'
import { XIcon, PlusIcon, CalendarIcon } from 'lucide-react'
import type { Task, Subtask } from '@/lib/types'

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  taskToEdit?: Task
}

export const TaskModal = ({ isOpen, onClose, taskToEdit }: TaskModalProps) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [priority, setPriority] = useState<'low'|'medium'|'high'>('medium')
  const [dueDate, setDueDate] = useState('')
  
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  
  const [subtasks, setSubtasks] = useState<Subtask[]>([])
  const [subtaskInput, setSubtaskInput] = useState('')
  const [showAdvance, setShowAdvance] = useState(false)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isDirty, setIsDirty] = useState(false)
  
  const { categories } = useCategories()
  const { createTask, updateTask } = useTasks()
  const toast = useToast()

  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        setTitle(taskToEdit.title)
        setDescription(taskToEdit.description || '')
        setCategoryId(taskToEdit.category_id || null)
        setPriority(taskToEdit.priority)
        setDueDate(taskToEdit.due_date || '')
        setTags(taskToEdit.tags || [])
        setSubtasks(taskToEdit.subtasks || [])
        setShowAdvance(!!(taskToEdit.tags?.length || taskToEdit.subtasks?.length))
      } else {
        setTitle('')
        setDescription('')
        setCategoryId(null)
        setPriority('medium')
        setDueDate('')
        setTags([])
        setSubtasks([])
        setShowAdvance(false)
      }
      setError('')
      setIsDirty(false)
    }
  }, [isOpen, taskToEdit])

  const handleClose = () => {
    if (isDirty && !window.confirm('You have unsaved changes. Are you sure you want to discard them?')) return
    onClose()
  }

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      const newTag = tagInput.trim().toLowerCase()
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag])
        setIsDirty(true)
      }
      setTagInput('')
    }
  }
  
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
    setIsDirty(true)
  }

  const handleAddSubtask = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && subtaskInput.trim()) {
      e.preventDefault()
      setSubtasks([...subtasks, { id: crypto.randomUUID(), title: subtaskInput.trim(), done: false }])
      setSubtaskInput('')
      setIsDirty(true)
    }
  }

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter(s => s.id !== id))
    setIsDirty(true)
  }

  const toggleSubtask = (id: string) => {
    setSubtasks(subtasks.map(s => s.id === id ? { ...s, done: !s.done } : s))
    setIsDirty(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || title.length < 2 || title.length > 100) {
      setError('Title must be between 2 and 100 characters.')
      return
    }

    setLoading(true)
    setError('')

    const taskData = {
      title: title.trim(),
      description: description.trim() || null,
      category_id: categoryId,
      priority,
      due_date: dueDate || null,
      tags,
      subtasks
    }

    try {
      if (taskToEdit) {
        const res = await updateTask(taskToEdit.id, taskData)
        if (res.error) throw new Error(res.error)
        toast.success('Task updated')
      } else {
        const res = await createTask(taskData)
        if (res.errors) throw new Error(res.errors[0].message)
        toast.success('Task created')
      }
      setIsDirty(false)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]
  const isPastDue = dueDate && dueDate < today

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={taskToEdit ? 'Edit Task' : 'New Task'}
      preventClose={loading || isDirty}
      footer={
        <>
          <Button variant="ghost" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading || !title.trim() || title.length < 2} isLoading={loading}>
            {taskToEdit ? 'Save Changes' : 'Create Task'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSave} className="flex flex-col gap-5 py-2">
        <Input
          label="Task Title"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            setError('')
            setIsDirty(true)
          }}
          autoFocus
          required
          maxLength={100}
        />
        <div className="text-right -mt-4 text-xs text-text-3">{title.length}/100</div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-1">Description (Optional)</label>
          <textarea
            className="form-input min-h-[80px] resize-y py-2"
            placeholder="Add details, links, or notes..."
            value={description}
            onChange={(e) => { setDescription(e.target.value); setIsDirty(true) }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-1">Category</label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto no-scrollbar border border-border rounded-lg p-2 bg-bg-sunken">
              <button
                type="button"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${!categoryId ? 'bg-bg-elevated text-text-1 border border-border shadow-sm ring-1 ring-accent' : 'text-text-2 hover:bg-bg-elevated border border-transparent'}`}
                onClick={() => { setCategoryId(null); setIsDirty(true) }}
              >
                No Category
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${categoryId === cat.id ? 'bg-bg-elevated text-text-1 border border-border shadow-sm ring-1 ring-accent' : 'text-text-2 hover:bg-bg-elevated border border-transparent'}`}
                  onClick={() => { setCategoryId(cat.id); setIsDirty(true) }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-1">Priority</label>
            <div className="flex p-1 bg-bg-sunken rounded-lg border border-border">
              {(['low', 'medium', 'high'] as const).map(p => (
                <button
                  key={p}
                  type="button"
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md capitalize transition-all ${priority === p ? 'bg-bg-surface shadow-sm text-text-1' : 'text-text-3 hover:text-text-2'}`}
                  onClick={() => { setPriority(p); setIsDirty(true) }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-text-1 mb-1 block">Due Date</label>
          <div className="relative">
            <CalendarIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
            <input
              type="date"
              className={`form-input pl-9 ${isPastDue ? 'text-warning border-warning-light focus:border-warning focus:ring-warning/20' : ''}`}
              value={dueDate}
              onChange={(e) => { setDueDate(e.target.value); setIsDirty(true) }}
            />
          </div>
          {isPastDue && <p className="text-xs text-warning mt-1">This date is in the past.</p>}
        </div>

        {error && (
          <p className="text-sm font-medium text-danger bg-danger-light p-2 rounded-md flex items-center gap-2">
            <span aria-hidden="true" className="shrink-0">⚠</span> {error}
          </p>
        )}

        {/* Advanced Options Toggle */}
        <button
          type="button"
          className="text-sm font-medium text-accent hover:underline flex items-center gap-1 w-max"
          onClick={() => setShowAdvance(!showAdvance)}
        >
          {showAdvance ? 'Hide advanced options' : 'Show advanced options'}
        </button>

        {showAdvance && (
          <div className="flex flex-col gap-5 pt-2 border-t border-border mt-2 animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-text-1">Tags (Press Enter to add)</label>
              <div className="flex flex-wrap gap-2 p-2 border border-border rounded-lg bg-bg-surface focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-colors">
                {tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 bg-bg-elevated px-2 py-1 rounded text-sm text-text-1">
                    #{tag}
                    <button type="button" onClick={() => handleRemoveTag(tag)} className="text-text-3 hover:text-danger ml-1" aria-label={`Remove tag ${tag}`}>
                      <XIcon size={14} />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  className="flex-1 min-w-[120px] bg-transparent outline-none text-sm placeholder-text-3"
                  placeholder="e.g. urgent, weekend"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-text-1 flex items-center justify-between">
                <span>Subtasks</span>
                <span className="text-xs text-text-3">{subtasks.filter(s => s.done).length}/{subtasks.length} done</span>
              </label>
              <div className="flex flex-col gap-2">
                {subtasks.map((s) => (
                  <div key={s.id} className="flex items-center gap-2 group p-2 hover:bg-bg-sunken rounded-md transition-colors border border-transparent hover:border-border">
                    <input
                      type="checkbox"
                      checked={s.done}
                      onChange={() => toggleSubtask(s.id)}
                      className="w-4 h-4 rounded text-accent focus:ring-accent border-border"
                    />
                    <span className={`flex-1 text-sm ${s.done ? 'line-through text-text-3' : 'text-text-1'}`}>{s.title}</span>
                    <button type="button" onClick={() => handleRemoveSubtask(s.id)} className="opacity-0 group-hover:opacity-100 p-1 text-text-3 hover:text-danger rounded transition-all">
                      <XIcon size={14} />
                    </button>
                  </div>
                ))}
                <div className="flex items-center gap-2 mt-1">
                  <PlusIcon size={16} className="text-text-3 shrink-0 ml-1" />
                  <input
                    type="text"
                    className="flex-1 bg-transparent border-b border-dashed border-border focus:border-accent outline-none text-sm py-1 placeholder-text-3"
                    placeholder="Add a subtask and press Enter..."
                    value={subtaskInput}
                    onChange={e => setSubtaskInput(e.target.value)}
                    onKeyDown={handleAddSubtask}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </Modal>
  )
}
