import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { validateCategory } from '@/lib/utils/validation'

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
    
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  
  return NextResponse.json({ categories: data })
}

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const body = await request.json()
  
  const validationErrors = validateCategory(body)
  if (validationErrors.length > 0) {
    return NextResponse.json({ errors: validationErrors }, { status: 422 })
  }
  
  const { data, error } = await supabase
    .from('categories')
    .insert({
      user_id: user.id,
      name:    body.name.trim(),
      color:   body.color || '#7C3AED',
      icon:    body.icon || 'folder'
    })
    .select()
    .single()
    
  if (error) {
    // Handle specific dup names
    if (error.code === '23505') {
      return NextResponse.json({ error: 'A category with this name already exists.' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ category: data }, { status: 201 })
}
