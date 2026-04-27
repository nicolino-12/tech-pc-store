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
  
  const email = data.email as string
  const password = data.password as string
  const confirmPassword = data.confirmPassword as string
  const fullName = data.fullName as string
  const phone = data.phone as string
  const address = data.address as string

  // Validar que las contraseñas coincidan
  if (password !== confirmPassword) {
    redirect('/login?message=' + encodeURIComponent('Las contraseñas no coinciden.'))
  }

  // 1. Registrar usuario en Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) {
    redirect('/login?message=' + encodeURIComponent(authError.message))
  }

  // 2. Crear perfil en la tabla profiles
  if (authData.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        full_name: fullName,
        phone: phone,
        address: address,
        role: 'user' // Por defecto son usuarios normales
      })

    if (profileError) {
      console.error("Error al crear perfil:", profileError)
    }
  }

  revalidatePath('/', 'layout')
  redirect('/login?message=¡Cuenta creada con éxito! Ya puedes iniciar sesión.')
}
