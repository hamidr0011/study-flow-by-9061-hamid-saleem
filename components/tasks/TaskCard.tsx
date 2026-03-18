'use client'
import React, { CSSProperties } from 'react'
import { formatRelativeDate } from '@/lib/utils/dates'
import { CheckIcon, CalendarIcon, EditIcon, TrashIcon } from 'lucide-react'
import type { Task } from '@/lib/types'

interface TaskCardProps {
  task:      Task
  onToggle:  (id: string) => void
  onEdit:    (task: Task) => void
  onDelete:  (id: string) => void
  compact?:  boolean
}

export const TaskCard = ({ task, onToggle, onEdit, onDelete, compact }: TaskCardProps) => {
  const category   = task.category
  const today      = new Date().toISOString().split('T')[0]
  const isOverdue  = !task.completed && !!task.due_date && task.due_date < today
  const isToday    = task.due_date === today
  const totalSubs  = task.subtasks?.length || 0
  const doneSubs   = task.subtasks?.filter(s => s.done).length || 0
  
  return (
    <article
      className={[
        'task-card group relative',
        task.completed ? 'task-done'    : '',
        isOverdue      ? 'task-overdue' : '',
        isToday && !task.completed ? 'task-today' : '',
        compact        ? 'task-compact flex-col !items-start gap-3 p-3' : ''
      ].join(' ')}
      data-task-id={task.id}
      tabIndex={0}
      aria-label={[
        `Task: ${task.title}.`,
        `Priority: ${task.priority}.`,
        task.completed ? 'Completed.' : 'Pending.',
        isOverdue ? 'Overdue.' : '',
        task.due_date ? `Due: ${formatRelativeDate(task.due_date)}` : ''
      ].join(' ')}
    >
      <div className={`flex w-full gap-3 items-start ${compact ? '' : 'flex-row'}`}>
        <button
          className={`task-checkbox shrink-0 mt-0.5 ${task.completed ? 'checked' : ''}`}
          onClick={(e) => { e.stopPropagation(); onToggle(task.id) }}
          aria-label={task.completed ? 'Mark as pending' : 'Mark as complete'}
          title={task.completed ? 'Click to reopen task' : 'Click to mark done'}
        >
          {task.completed && <CheckIcon size={14} aria-hidden="true" className="text-white" />}
        </button>
        
        <div className="task-content flex-1 min-w-0 flex flex-col cursor-pointer" onClick={() => onEdit(task)}>
          <div className="flex items-center gap-2 mb-1">
            <span 
              className={`priority-dot priority-${task.priority} shrink-0`}
              title={`${task.priority} priority`}
              aria-label={`${task.priority} priority`}
            />
            <span className={`task-title text-base font-medium text-text-1 truncate ${task.completed ? 'line-through text-text-3' : ''}`}>
              {task.title}
            </span>
          </div>
          
          {!compact && task.description && (
            <p className="task-desc text-sm text-text-2 mb-2 line-clamp-2">
              {task.description}
            </p>
          )}
          
          <div className="task-meta flex flex-wrap items-center gap-2 mt-1">
            {category && (
              <span 
                className="category-chip text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1.5"
                style={{ backgroundColor: `${category.color}20`, color: category.color }}
                aria-label={`Category: ${category.name}`}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: category.color }} aria-hidden="true" />
                {category.name}
              </span>
            )}
            
            {task.due_date ? (
              <span 
                className={`due-chip text-xs font-medium flex items-center gap-1 ${
                  isOverdue ? 'text-danger' : isToday ? 'text-accent' : 'text-text-3'
                }`}
                aria-label={`${isOverdue ? 'Overdue: ' : isToday ? 'Due today: ' : 'Due: '}${formatRelativeDate(task.due_date)}`}
              >
                <CalendarIcon size={12} aria-hidden="true" />
                {formatRelativeDate(task.due_date)}
              </span>
            ) : (
              <span className="no-date-chip text-xs text-text-3 opacity-60 flex items-center gap-1" aria-label="No due date">
                <CalendarIcon size={12} aria-hidden="true" />
                No date
              </span>
            )}
            
            {task.tags?.slice(0, 2).map(tag => (
              <span key={tag} className="tag-chip text-xs text-text-2 bg-bg-sunken px-1.5 py-0.5 rounded" aria-label={`Tag: ${tag}`}>
                #{tag}
              </span>
            ))}
            
            {totalSubs > 0 && (
              <span className="subtask-chip text-xs text-text-2 font-medium bg-bg-sunken px-1.5 py-0.5 rounded flex items-center gap-1"
                    aria-label={`${doneSubs} of ${totalSubs} subtasks done`}>
                <CheckIcon size={12} /> {doneSubs}/{totalSubs}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {totalSubs > 0 && !compact && (
        <div 
          className="subtask-bar w-full h-1 bg-border rounded-full mt-3 overflow-hidden"
          role="progressbar"
          aria-valuenow={Math.round((doneSubs/totalSubs)*100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Subtasks: ${doneSubs}/${totalSubs} complete`}
        >
          <div 
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${(doneSubs/totalSubs)*100}%` }}
          />
        </div>
      )}
      
      <div 
        className={`task-actions absolute ${compact ? 'top-2 right-2' : 'top-1/2 -translate-y-1/2 right-4'} flex gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity bg-bg-surface p-1 shadow-sm rounded-lg border border-border`}
        role="group" 
        aria-label={`Actions for ${task.title}`}
      >
        <button
          className="w-8 h-8 flex items-center justify-center rounded text-text-3 hover:text-accent hover:bg-accent-light transition-colors"
          onClick={(e) => { e.stopPropagation(); onEdit(task) }}
          aria-label={`Edit: ${task.title}`}
          title="Edit task"
        >
          <EditIcon size={16} aria-hidden="true" />
        </button>
        <button
          className="w-8 h-8 flex items-center justify-center rounded text-text-3 hover:text-danger hover:bg-danger-light transition-colors"
          onClick={(e) => { e.stopPropagation(); onDelete(task.id) }}
          aria-label={`Delete: ${task.title}`}
          title="Delete task"
        >
          <TrashIcon size={16} aria-hidden="true" />
        </button>
      </div>
    </article>
  )
}
