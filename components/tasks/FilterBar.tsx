'use client'
import React, { CSSProperties } from 'react'
import type { Task, Category } from '@/lib/types'

interface FilterBarProps {
  tasks: Task[]
  categories: Category[]
  onFilter: (id: string) => void
  activeFilter: string
}

export const FilterBar = ({ tasks, categories, onFilter, activeFilter }: FilterBarProps) => {
  const today = new Date().toISOString().split('T')[0]
  
  const chips = [
    { 
      id:    'all', 
      label: 'All', 
      count: tasks.filter(t => !t.completed).length,
      type:  'primary' as const
    },
    ...categories
      .map(cat => ({
        id:    `category:${cat.id}`,
        label: cat.name,
        count: tasks.filter(t => !t.completed && t.category_id === cat.id).length,
        color: cat.color,
        type:  'category' as const
      }))
      .filter(c => c.count > 0),
      
    ...(tasks.filter(t => !t.completed && t.due_date && t.due_date < today).length > 0 ? [{
      id:    'overdue',
      label: 'Overdue',
      count: tasks.filter(t => !t.completed && t.due_date && t.due_date < today).length,
      type:  'danger' as const
    }] : []),
    
    ...(tasks.filter(t => !t.completed && t.priority === 'high').length > 0 ? [{
      id:    'high-priority',
      label: 'High Priority',
      count: tasks.filter(t => !t.completed && t.priority === 'high').length,
      type:  'danger' as const
    }] : []),
    
    ...(tasks.filter(t => !t.completed && !t.due_date).length > 0 ? [{
      id:    'no-date',
      label: 'No Due Date',
      count: tasks.filter(t => !t.completed && !t.due_date).length,
      type:  'neutral' as const
    }] : []),
    
    ...(tasks.filter(t => t.completed).length > 0 ? [{
      id:    'completed',
      label: 'Completed',
      count: tasks.filter(t => t.completed).length,
      type:  'success' as const
    }] : []),
  ]
  
  return (
    <div className="filter-bar w-full overflow-x-auto pb-2 -mb-2 no-scrollbar" role="toolbar" aria-label="Filter tasks">
      <div className="filter-chips flex items-center gap-2 w-max" role="group" aria-label="Filter by category or status">
        {chips.map(chip => (
          <button
            key={chip.id}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all border
              ${activeFilter === chip.id 
                ? 'bg-text-1 text-bg-surface border-text-1 ring-2 ring-offset-1 ring-border shadow-sm' 
                : 'bg-bg-surface text-text-2 border-border hover:border-border-strong hover:bg-bg-elevated'
              }
              ${chip.type === 'danger' && activeFilter !== chip.id ? 'text-danger border-danger-light bg-danger-light/30' : ''}
              ${chip.type === 'success' && activeFilter !== chip.id ? 'text-success border-success-light bg-success-light/30' : ''}
            `}
            style={chip.color && activeFilter !== chip.id ? { borderColor: `${chip.color}50`, backgroundColor: `${chip.color}10` } : undefined}
            onClick={() => onFilter(chip.id)}
            aria-pressed={activeFilter === chip.id}
            aria-label={`Filter: ${chip.label}, ${chip.count} tasks`}
          >
            {chip.color && (
              <span className={`w-2 h-2 rounded-full ${activeFilter === chip.id ? 'bg-bg-surface' : ''}`} style={activeFilter !== chip.id ? { background: chip.color } : undefined} aria-hidden="true" />
            )}
            {chip.label}
            <span className={`px-1.5 py-0.5 rounded text-xs font-bold leading-none ${activeFilter === chip.id ? 'bg-bg-surface text-text-1' : 'bg-bg-sunken text-text-3'}`} aria-hidden="true">
              {chip.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
