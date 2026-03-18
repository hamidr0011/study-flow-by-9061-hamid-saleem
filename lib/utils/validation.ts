import type { ValidationError } from '@/lib/types'

export function validateTask(data: Record<string, unknown>): 
ValidationError[] {
  const errors: ValidationError[] = []
  
  // Title
  const title = String(data.title || '').trim()
  if (!title) {
    errors.push({ 
      field: 'title', 
      message: 'Please enter a task title to continue.' 
    })
  } else if (title.length < 2) {
    errors.push({ 
      field: 'title', 
      message: 'Title must be at least 2 characters long.' 
    })
  } else if (title.length > 100) {
    errors.push({ 
      field: 'title', 
      message: 'Title cannot exceed 100 characters.' 
    })
  }
  
  // Priority
  const validPriorities = ['high', 'medium', 'low']
  if (data.priority && !validPriorities.includes(String(data.priority))) {
    errors.push({ 
      field: 'priority', 
      message: 'Priority must be High, Medium, or Low.' 
    })
  }
  
  // Due date
  if (data.due_date) {
    const date = new Date(String(data.due_date) + 'T00:00:00')
    if (isNaN(date.getTime())) {
      errors.push({ 
        field: 'due_date', 
        message: 'Please enter a valid date.' 
      })
    } else {
      const tenYears = new Date()
      tenYears.setFullYear(tenYears.getFullYear() + 10)
      if (date > tenYears) {
        errors.push({ 
          field: 'due_date', 
          message: 'Due date seems too far in the future. Please check.'
        })
      }
    }
  }
  
  // Description
  if (data.description && String(data.description).length > 1000) {
    errors.push({ 
      field: 'description', 
      message: 'Description cannot exceed 1000 characters.' 
    })
  }
  
  return errors
}

export function validateEmail(email: string): string | null {
  // HCI: Heuristic 9 — specific helpful error messages
  if (!email.trim()) return 'Email address is required.'
  if (!email.includes('@')) 
    return 'Please enter a valid email address (missing @).'
  if (!email.includes('.')) 
    return 'Please enter a valid email address.'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) 
    return 'Please enter a valid email address.'
  return null
}

export function validatePassword(password: string): {
  errors:   string[]
  strength: 'weak' | 'fair' | 'strong' | 'very-strong'
  score:    number
} {
  const errors: string[] = []
  let score = 0
  
  if (password.length < 8) {
    errors.push('At least 8 characters')
  } else { score++ }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('At least one uppercase letter')
  } else { score++ }
  
  if (!/[a-z]/.test(password)) {
    errors.push('At least one lowercase letter')
  } else { score++ }
  
  if (!/[0-9]/.test(password)) {
    errors.push('At least one number')
  } else { score++ }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('At least one special character (!@#$...)')
  } else { score++ }
  
  const strength = 
    score <= 1 ? 'weak'        :
    score <= 2 ? 'fair'        :
    score <= 3 ? 'strong'      : 'very-strong'
  
  return { errors, strength, score }
}

export function validateCategory(data: Record<string, unknown>):
ValidationError[] {
  const errors: ValidationError[] = []
  const name = String(data.name || '').trim()
  
  if (!name) {
    errors.push({ 
      field: 'name', 
      message: 'Please enter a category name.' 
    })
  } else if (name.length > 50) {
    errors.push({ 
      field: 'name', 
      message: 'Category name cannot exceed 50 characters.' 
    })
  }
  
  if (data.color) {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    if (!hexRegex.test(String(data.color))) {
      errors.push({ 
        field: 'color', 
        message: 'Please select a valid color.' 
      })
    }
  }
  
  return errors
}
