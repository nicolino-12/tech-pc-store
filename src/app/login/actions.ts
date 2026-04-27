'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = createClient()
  const data = Object.fromEntries(formData.entries())
  
  const { error } = await supabase.auth.signInWithPassword({
    email: data.email as string,
    password: data.password as string,
  })

  if (error) {
    redirect('/login?message=' + encodeURIComponent(error.message))
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = createClient()
  const data = Object.fromEntries(formData.entries())
  
  const { error } = await supabase.auth.signUp({
    email: data.email as string,
    password: data.password as string,
  })

  if (error) {
    redirect('/login?message=' + encodeURIComponent(error.message))
  }

  revalidatePath('/', 'layout')
  redirect('/login?message=¡Cuenta creada! Revisa tu correo o intenta iniciar sesión directamente.')
}
