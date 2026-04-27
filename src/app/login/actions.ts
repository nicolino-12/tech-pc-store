'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { resend } from '@/utils/resend'

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

    // 3. Enviar Correo de Bienvenida
    try {
      await resend.emails.send({
        from: 'Tech PC Store <onboarding@resend.dev>',
        to: [email],
        subject: '¡Bienvenido a la Élite Tecnológica! 🚀',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
            <h2 style="color: #00f0ff; background: #000; padding: 10px; text-align: center;">TECH PC STORE</h2>
            <p>Hola <strong>${fullName}</strong>,</p>
            <p>¡Bienvenido a la mejor tienda de hardware! Estamos emocionados de tenerte con nosotros.</p>
            <p>Como regalo de bienvenida, aquí tienes un cupón de descuento para tu primera compra:</p>
            <div style="background: #f4f4f4; padding: 10px; text-align: center; border: 1px dashed #00f0ff; font-weight: bold; font-size: 20px;">
              BIENVENIDA10
            </div>
            <p style="font-size: 12px; color: #888; text-align: center;">Válido por un 10% de descuento en cualquier componente.</p>
            <hr />
            <p>¡Que comience el armado de tu setup!</p>
          </div>
        `,
      });
    } catch (e) {
      console.error("No se pudo enviar el correo de bienvenida");
    }
  }

  revalidatePath('/', 'layout')
  redirect('/login?message=¡Cuenta creada con éxito! Ya puedes iniciar sesión.')
}
