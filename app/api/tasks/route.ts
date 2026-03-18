import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { validateTask } from '@/lib/utils/validation'

// GET /api/tasks — get all tasks for authenticated user
export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { searchParams } = new URL(request.url)
  const categoryId = searchParams.get('category')
  const completed  = searchParams.get('completed')
  const search     = searchParams.get('search')
  
  let query = supabase
    .from('tasks')
    .select(`
      *,
      category:categories(id, name, color, icon)
    `)
    .eq('user_id', user.id)
    .eq('deleted', false)
    .order('created_at', { ascending: false })
  
  if (categoryId) query = query.eq('category_id', categoryId)
  if (completed !== null) query = query.eq('completed', completed === 'true')
  if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
  
  const { data, error } = await query
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ tasks: data })
}

// POST /api/tasks — create new task
export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const body = await request.json()
  
  // Server-side validation
  const validationErrors = validateTask(body)
  if (validationErrors.length > 0) {
    return NextResponse.json({ errors: validationErrors }, { status: 422 })
  }
  
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      user_id:     user.id,
      title:       body.title.trim(),
      description: body.description?.trim() || null,
      category_id: body.category_id || null,
      priority:    body.priority || 'medium',
      due_date:    body.due_date || null,
      tags:        body.tags || [],
      subtasks:    body.subtasks || []
    })
    .select(`
      *,
      category:categories(id, name, color, icon)
    `)
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ task: data }, { status: 201 })
}
