'use client'
import React, { useState } from 'react'
import { useTasks } from '@/lib/hooks/useTasks'
import { TaskCard } from '@/components/tasks/TaskCard'
import { TaskModal } from '@/components/tasks/TaskModal'
import { Button } from '@/components/ui/Button'
import { Skeleton, EmptyState } from '@/components/ui/Skeleton'
import { ListIcon, LayoutGridIcon, PlusIcon, CheckCircleIcon } from 'lucide-react'
import type { Task } from '@/lib/types'

export default function TasksPage() {
  const { tasks, loading, toggleTask, deleteTask } = useTasks()
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list')
  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined)

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task)
    setTaskModalOpen(true)
  }

  const handleCreateTask = () => {
    setTaskToEdit(undefined)
    setTaskModalOpen(true)
  }

  // Board columns (Group by Priority)
  const columns = [
    { id: 'high', label: 'High Priority', color: 'var(--danger)', items: tasks.filter(t => !t.completed && t.priority === 'high') },
    { id: 'medium', label: 'Medium Priority', color: 'var(--warning)', items: tasks.filter(t => !t.completed && t.priority === 'medium') },
    { id: 'low', label: 'Low Priority', color: 'var(--success)', items: tasks.filter(t => !t.completed && t.priority === 'low') },
    { id: 'completed', label: 'Completed', color: 'var(--text-3)', items: tasks.filter(t => t.completed) }
  ]

  // List view simple pending/done split
  const pendingTasks = tasks.filter(t => !t.completed)
  const completedTasks = tasks.filter(t => t.completed)

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto h-full pb-6">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-text-1">Tasks</h1>
          <p className="text-text-2 mt-1">Manage and organize all your work.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-bg-sunken p-1 rounded-lg border border-border shrink-0">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-bg-surface text-text-1 shadow-sm' : 'text-text-3 hover:text-text-2'}`}
              aria-label="List view"
            >
              <ListIcon size={18} />
            </button>
            <button
              onClick={() => setViewMode('board')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'board' ? 'bg-bg-surface text-text-1 shadow-sm' : 'text-text-3 hover:text-text-2'}`}
              aria-label="Board view"
            >
              <LayoutGridIcon size={18} />
            </button>
          </div>
          
          <Button onClick={handleCreateTask} className="hidden sm:flex items-center gap-2">
            <PlusIcon size={18} />
            Add Task
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            icon={<CheckCircleIcon size={48} className="text-accent/50" />}
            title="Clean slate!"
            description="You don't have any tasks yet. Create one to get started."
            action={<Button onClick={handleCreateTask}>Create Task</Button>}
          />
        </div>
      ) : viewMode === 'list' ? (
        <div className="flex flex-col gap-8 animate-in fade-in max-w-3xl">
          {pendingTasks.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-bold text-text-3 uppercase tracking-wider mb-1">To Do</h2>
              {pendingTasks.map(task => (
                 <TaskCard key={task.id} task={task} onToggle={toggleTask} onEdit={handleEditTask} onDelete={deleteTask} />
              ))}
            </section>
          )}
          
          {completedTasks.length > 0 && (
            <section className="flex flex-col gap-3 opacity-60 hover:opacity-100 transition-opacity">
               <h2 className="text-sm font-bold text-text-3 uppercase tracking-wider mb-1">Completed</h2>
               {completedTasks.map(task => (
                 <TaskCard key={task.id} task={task} onToggle={toggleTask} onEdit={handleEditTask} onDelete={deleteTask} compact />
               ))}
            </section>
          )}
        </div>
      ) : (
        <div className="flex gap-6 h-full min-h-[500px] overflow-x-auto pb-4 px-2 -mx-2 animate-in fade-in relative snap-x">
          {columns.map(col => (
            <div key={col.id} className="flex-shrink-0 w-80 flex flex-col gap-3 snap-start">
              <div className="flex items-center gap-2 mb-2 sticky top-0 bg-bg-surface py-2 z-10">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
                <h3 className="font-bold text-text-1">{col.label}</h3>
                <span className="bg-bg-sunken text-text-3 text-xs font-bold px-2 py-0.5 rounded-full ml-auto">
                  {col.items.length}
                </span>
              </div>
              
              <div className="flex flex-col gap-3 flex-1 overflow-y-auto no-scrollbar pb-8">
                {col.items.length === 0 ? (
                  <div className="border border-dashed border-border rounded-xl p-4 text-center text-sm text-text-3 bg-bg-sunken/50">
                    No tasks
                  </div>
                ) : (
                  col.items.map(task => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      onToggle={toggleTask} 
                      onEdit={handleEditTask} 
                      onDelete={deleteTask} 
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        taskToEdit={taskToEdit}
      />
    </div>
  )
}
