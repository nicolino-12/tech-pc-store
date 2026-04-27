import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: any;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createClient();

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;

    // 1. Marcar el pedido como pagado en Supabase
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .update({ status: 'paid' })
      .eq('stripe_session_id', session.id)
      .select('*')
      .single();

    if (orderError) {
      console.error('Error updating order to paid:', orderError.message);
    } else if (order) {
      // 2. Reducir el stock de cada producto comprado
      const items = order.items as any[]; // Array de {id, quantity, name, ...}
      
      for (const item of items) {
        // Ejecutar un RPC o una actualización simple
        // Nota: En un entorno de alto tráfico se recomienda un RPC para evitar condiciones de carrera
        const { error: stockError } = await supabase.rpc('decrement_product_stock', {
          product_id: item.id,
          qty: item.quantity
        });

        if (stockError) {
          // Si falla el RPC, intentamos una actualización directa por si no creó la función
          console.error(`Error deducting stock for product ${item.id}:`, stockError.message);
          
          // Intento de actualización directa (Fallback)
          const { data: p } = await supabase.from('products').select('stock').eq('id', item.id).single();
          if (p) {
            await supabase.from('products').update({ stock: Math.max(0, p.stock - item.quantity) }).eq('id', item.id);
          }
        }
      }
      
      console.log(`Order ${order.id} processed and stock updated.`);
    }
  }

  return NextResponse.json({ received: true });
}
