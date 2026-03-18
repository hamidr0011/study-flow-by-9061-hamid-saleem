import type { Task, TaskGroup } from '@/lib/types'

// HCI: Heuristic 2 — Match System to Real World
// Always show human-readable dates, never raw timestamps

export function formatRelativeDate(dateStr: string): string {
  const date  = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const diffMs   = date.getTime() - today.getTime()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays < -1)  return `${Math.abs(diffDays)} days ago`
  if (diffDays === -1) return 'Yesterday'
  if (diffDays === 0)  return 'Today'
  if (diffDays === 1)  return 'Tomorrow'
  if (diffDays <= 6)   return `In ${diffDays} days`
  if (diffDays <= 13)  return `Next ${date.toLocaleDateString(
    'en-US', { weekday: 'long' })}`
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', day: 'numeric',
    year: date.getFullYear() !== today.getFullYear() ? 
          'numeric' : undefined
  })
}

export function groupTasksByDate(tasks: Task[]): TaskGroup[] {
  const today    = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString().split('T')[0]
  
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split('T')[0]
  
  const weekEnd = new Date(today)
  weekEnd.setDate(weekEnd.getDate() + 7)
  
  const nextWeekEnd = new Date(today)
  nextWeekEnd.setDate(nextWeekEnd.getDate() + 14)
  
  const groups: Record<string, Task[]> = {
    overdue:  [],
    today:    [],
    tomorrow: [],
    thisWeek: [],
    nextWeek: [],
    later:    [],
    noDate:   []
  }
  
  tasks.forEach(task => {
    if (!task.due_date) {
      groups.noDate.push(task)
      return
    }
    
    const due  = new Date(task.due_date + 'T00:00:00')
    const diff = Math.round(
      (due.getTime() - today.getTime()) / (1000*60*60*24)
    )
    
    if (diff < 0)       groups.overdue.push(task)
    else if (diff === 0) groups.today.push(task)
    else if (diff === 1) groups.tomorrow.push(task)
    else if (diff <= 7)  groups.thisWeek.push(task)
    else if (diff <= 14) groups.nextWeek.push(task)
    else                 groups.later.push(task)
  })
  
  return [
    { key: 'overdue',  label: 'Overdue',    tasks: groups.overdue  },
    { key: 'today',    label: 'Today',      tasks: groups.today    },
    { key: 'tomorrow', label: 'Tomorrow',   tasks: groups.tomorrow },
    { key: 'thisWeek', label: 'This Week',  tasks: groups.thisWeek },
    { key: 'nextWeek', label: 'Next Week',  tasks: groups.nextWeek },
    { key: 'later',    label: 'Later',      tasks: groups.later    },
    { key: 'noDate',   label: 'No Due Date',tasks: groups.noDate   },
  ].filter(g => g.tasks.length > 0)
}

export function getGreeting(name?: string): string {
  // HCI: Heuristic 2 — real world language
  const hour = new Date().getHours()
  const time  = hour < 12 ? 'morning' :
                hour < 17 ? 'afternoon' :
                hour < 21 ? 'evening' : 'night'
  return name ? 
    `Good ${time}, ${name.split(' ')[0]}!` : 
    `Good ${time}!`
}
