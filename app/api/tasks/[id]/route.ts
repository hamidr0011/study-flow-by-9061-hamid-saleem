import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// PATCH /api/tasks/[id] — update task
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const body = await request.json()
  
  // Build update — only include fields that were sent
  const updates: Record<string, unknown> = {}
  const allowed = ['title','description','category_id','priority','due_date','tags','subtasks','completed']
  allowed.forEach(field => {
    if (body[field] !== undefined) updates[field] = body[field]
  })
  
  if (body.completed === true) {
    updates.completed_at = new Date().toISOString()
  } else if (body.completed === false) {
    updates.completed_at = null
  }
  
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', params.id)
    .eq('user_id', user.id)  // ensure user owns this task
    .select(`
      *,
      category:categories(id, name, color, icon)
    `)
    .single()
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  
  return NextResponse.json({ task: data })
}

// DELETE /api/tasks/[id] — soft delete (for undo support)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  // Soft delete
  const { error } = await supabase
    .from('tasks')
    .update({ deleted: true, deleted_at: new Date().toISOString() })
    .eq('id', params.id)
    .eq('user_id', user.id)
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  
  return NextResponse.json({ success: true })
}

// PUT /api/tasks/[id] — restore (undo delete)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const { error } = await supabase
    .from('tasks')
    .update({ deleted: false, deleted_at: null })
    .eq('id', params.id)
    .eq('user_id', user.id)
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  
  return NextResponse.json({ success: true })
}
