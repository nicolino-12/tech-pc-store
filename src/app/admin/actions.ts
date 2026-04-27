'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { resend } from '@/utils/resend'

export async function addProduct(formData: FormData) {
  const supabase = createClient()
  
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const image = formData.get('image') as string
  const category = formData.get('category') as string

  const { error } = await supabase.from('products').insert([
    { name, description, price, image, category }
  ])

  if (error) {
    redirect('/admin?error=' + encodeURIComponent(error.message))
  }

  // Refrescar el caché de la página principal para que aparezca el nuevo producto
  revalidatePath('/')
  redirect('/admin?success=1')
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = createClient()
  
  // Obtener datos del pedido antes de actualizar para el correo
  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single()

  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)

  if (error) {
    throw new Error(error.message)
  }

  // Enviar correo si el estado es 'shipped' (Enviado)
  if (status === 'shipped' && order?.customer_email) {
    try {
      await resend.emails.send({
        from: 'Tech PC Store <onboarding@resend.dev>', // Usar dominio verificado en prod
        to: [order.customer_email],
        subject: `¡Tu pedido #${order.id.slice(0, 8)} ha sido enviado! 🚀`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
            <h2 style="color: #00f0ff; background: #000; padding: 10px; text-align: center;">TECH PC STORE</h2>
            <p>Hola <strong>${order.customer_name}</strong>,</p>
            <p>¡Buenas noticias! Tu pedido ha sido enviado y está en camino.</p>
            <hr />
            <p><strong>Detalles del Envío:</strong></p>
            <p>${order.shipping_address}, ${order.city}, ${order.country}</p>
            <hr />
            <p>Pronto recibirás tus componentes de alto rendimiento.</p>
            <p>Gracias por confiar en nosotros.</p>
            <br />
            <p style="font-size: 12px; color: #888;">Este es un correo automático, por favor no respondas.</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Error enviando correo:", emailError);
      // No lanzamos error para no bloquear la actualización del estado si falla el mail
    }
  }

  revalidatePath('/admin/orders')
}
