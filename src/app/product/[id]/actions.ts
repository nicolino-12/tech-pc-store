'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitReview(productId: string, rating: number, comment: string) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Debes iniciar sesión para dejar una reseña")

  const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()

  const { error } = await supabase.from('reviews').insert([
    {
      product_id: productId,
      user_id: user.id,
      rating,
      comment,
      user_name: profile?.full_name || user.email
    }
  ])

  if (error) throw new Error(error.message)

  revalidatePath(`/product/${productId}`)
}
