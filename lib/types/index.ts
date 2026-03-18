export type Priority = 'high' | 'medium' | 'low'
export type TaskView = 'list' | 'board'

export interface Profile {
  id:             string
  full_name:      string | null
  avatar_url:     string | null
  dark_mode:      boolean
  default_view:   TaskView
  show_completed: boolean
  streak_count:   number
  last_active:    string | null
  created_at:     string
  updated_at:     string
}

export interface Category {
  id:         string
  user_id:    string
  name:       string
  color:      string
  icon:       string
  created_at: string
}

export interface Subtask {
  id:    string
  title: string
  done:  boolean
}

export interface Task {
  id:           string
  user_id:      string
  category_id:  string | null
  title:        string
  description:  string | null
  priority:     Priority
  due_date:     string | null  // YYYY-MM-DD
  tags:         string[]
  subtasks:     Subtask[]
  completed:    boolean
  completed_at: string | null
  deleted:      boolean
  deleted_at:   string | null
  created_at:   string
  updated_at:   string
  // joined
  category?:    Category | null
}

export interface TaskGroup {
  label:  string
  key:    string
  tasks:  Task[]
}

export interface TaskStats {
  total:          number
  completed:      number
  pending:        number
  overdue:        number
  dueToday:       number
  completedToday: number
  completionRate: number
}

export interface ValidationError {
  field:   string
  message: string
}

export interface ToastOptions {
  type:          'success' | 'error' | 'warning' | 'info'
  message:       string
  undoCallback?: () => void
  duration?:     number
}
