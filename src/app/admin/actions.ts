'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function addProduct(formData: FormData) {
  const supabase = createClient()
  
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const image = formData.get('image') as string

  const { error } = await supabase.from('products').insert([
    { name, description, price, image }
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
  
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/orders')
}
