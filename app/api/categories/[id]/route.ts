import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { validateCategory } from '@/lib/utils/validation'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const body = await request.json()
  
  const validationErrors = validateCategory(body)
  if (validationErrors.length > 0) {
    return NextResponse.json({ errors: validationErrors }, { status: 422 })
  }
  
  const updates: Record<string, unknown> = {}
  if (body.name) updates.name = body.name.trim()
  if (body.color) updates.color = body.color
  if (body.icon) updates.icon = body.icon
  
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', params.id)
    .eq('user_id', user.id)
    .select()
    .single()
    
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  
  return NextResponse.json({ category: data })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  // Checking if tasks exist
  const { count } = await supabase
    .from('tasks')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', params.id)
    .eq('deleted', false)
    
  if (count && count > 0) {
    return NextResponse.json({ error: 'Cannot delete a category that contains active tasks. Please remove tasks first.' }, { status: 400 })
  }
  
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', params.id)
    .eq('user_id', user.id)
    
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  
  return NextResponse.json({ success: true })
}
