'use client'
import React, { useState } from 'react'
import { useTasks } from '@/lib/hooks/useTasks'
import { useCategories } from '@/lib/hooks/useCategories'
import { TaskCard } from '@/components/tasks/TaskCard'
import { TaskModal } from '@/components/tasks/TaskModal'
import { CategoryModal } from '@/components/categories/CategoryModal'
import { FilterBar } from '@/components/tasks/FilterBar'
import { Button } from '@/components/ui/Button'
import { EmptyState, Skeleton } from '@/components/ui/Skeleton'
import { PlusIcon, CheckCircleIcon } from 'lucide-react'
import type { Task } from '@/lib/types'

export default function DashboardPage() {
  const { tasks, loading: tasksLoading, toggleTask, deleteTask } = useTasks()
  const { categories, loading: catsLoading } = useCategories()
  
  const [activeFilter, setActiveFilter] = useState('all')
  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined)
  const [catModalOpen, setCatModalOpen] = useState(false)
  
  const loading = tasksLoading || catsLoading

  const filteredTasks = tasks.filter(task => {
    if (activeFilter === 'all') return !task.completed
    if (activeFilter === 'completed') return task.completed
    if (activeFilter.startsWith('category:')) {
      return !task.completed && task.category_id === activeFilter.split(':')[1]
    }
    if (activeFilter === 'overdue') {
      const today = new Date().toISOString().split('T')[0]
      return !task.completed && !!task.due_date && task.due_date < today
    }
    if (activeFilter === 'high-priority') return !task.completed && task.priority === 'high'
    if (activeFilter === 'no-date') return !task.completed && !task.due_date
    return true
  })

  // Grouping logic for "Match System to Real World" HCI Heuristic
  const groupedTasks = filteredTasks.reduce((acc, task) => {
    let group = 'No due date'
    if (task.completed) group = 'Completed'
    else if (task.due_date) {
      const today = new Date().toISOString().split('T')[0]
      if (task.due_date < today) group = 'Overdue'
      else if (task.due_date === today) group = 'Today'
      else group = 'Upcoming'
    }
    if (!acc[group]) acc[group] = []
    acc[group].push(task)
    return acc
  }, {} as Record<string, Task[]>)

  const order = ['Overdue', 'Today', 'Upcoming', 'No due date', 'Completed']

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task)
    setTaskModalOpen(true)
  }

  const handleCreateTask = () => {
    setTaskToEdit(undefined)
    setTaskModalOpen(true)
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-1">Dashboard</h1>
          <p className="text-text-2 mt-1">Here&apos;s a quick overview of your tasks.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setCatModalOpen(true)} className="hidden sm:flex">
            New Category
          </Button>
          <Button onClick={handleCreateTask} className="flex items-center gap-2 shadow-sm shadow-accent/20">
            <PlusIcon size={18} />
            Add Task
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-6">
          <Skeleton className="h-14 w-full rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={<CheckCircleIcon size={48} className="text-accent/50" />}
          title="You have no tasks yet!"
          description="Create your first task to get started."
          action={<Button onClick={handleCreateTask}>Create Task</Button>}
        />
      ) : (
        <>
          <FilterBar
            tasks={tasks}
            categories={categories}
            activeFilter={activeFilter}
            onFilter={setActiveFilter}
          />

          <div className="flex flex-col gap-10 mt-2">
            {order.map(group => {
              const groupTasks = groupedTasks[group] || []
              if (groupTasks.length === 0) return null
              
              const isOverdue = group === 'Overdue'
              const isCompleted = group === 'Completed'

              return (
                <section key={group} className="flex flex-col gap-4 animate-in fade-in duration-300">
                  <div className="flex items-center gap-3">
                    <h3 className={`text-lg font-bold tracking-tight ${isOverdue ? 'text-danger' : isCompleted ? 'text-success' : 'text-text-1'}`}>
                      {group}
                    </h3>
                    <span className="text-xs font-bold bg-bg-sunken text-text-3 px-2 py-0.5 rounded-full">
                      {groupTasks.length}
                    </span>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {groupTasks.map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onToggle={toggleTask}
                        onEdit={handleEditTask}
                        onDelete={deleteTask}
                      />
                    ))}
                  </div>
                </section>
              )
            })}
            
            {filteredTasks.length === 0 && activeFilter !== 'all' && (
              <div className="py-12 text-center border border-dashed border-border rounded-xl bg-bg-surface">
                <p className="text-text-2">No tasks match this filter.</p>
                <button
                  className="mt-2 text-accent text-sm font-medium hover:underline"
                  onClick={() => setActiveFilter('all')}
                >
                  Clear filter
                </button>
              </div>
            )}
          </div>
        </>
      )}

      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        taskToEdit={taskToEdit}
      />
      
      <CategoryModal
        isOpen={catModalOpen}
        onClose={() => setCatModalOpen(false)}
      />
    </div>
  )
}
