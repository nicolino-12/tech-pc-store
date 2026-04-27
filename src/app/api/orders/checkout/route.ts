import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
});

export async function POST(req: Request) {
  try {
    const { items, customerDetails } = await req.json();
    const supabase = createClient();

    // Obtener el ID del usuario si está logueado
    const { data: { user } } = await supabase.auth.getUser();
    
    // Obtener la URL actual (para saber si estamos en localhost:3000 o 3001)
    const origin = req.headers.get('origin') || 'http://localhost:3001';

    if (!items || items.length === 0) {
      return new NextResponse("El carrito está vacío", { status: 400 });
    }

    // Transformar los productos del carrito al formato que Stripe requiere
    const line_items = items.map((item: any) => {
      return {
        quantity: item.quantity,
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            // Stripe solo acepta URLs válidas para imágenes
            images: item.image && item.image.startsWith('http') ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100), // Stripe requiere el precio en centavos
        }
      };
    });

    // Calcular subtotal y envío (Gratis si es > $1000, si no $25)
    const subtotal = items.reduce((total: number, item: any) => total + item.price * item.quantity, 0);
    const shippingCostCents = subtotal > 1000 ? 0 : 2500; 

    // Crear la sesión de pago
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      customer_email: customerDetails?.email, // Pre-llenar el email si se proporcionó
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'ES', 'MX', 'AR', 'CL'],
      },
      // Metadatos para rastrear el pedido en el dashboard de Stripe
      metadata: {
        customerName: customerDetails?.name || 'Cliente sin nombre',
        customerPhone: customerDetails?.phone || '',
        customerAddress: customerDetails?.address || '',
        customerCity: customerDetails?.city || '',
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: shippingCostCents, currency: 'usd' },
            display_name: shippingCostCents === 0 ? 'Envío Gratis (Promo > $1000)' : 'Envío Estándar',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 2 },
              maximum: { unit: 'business_day', value: 5 },
            },
          },
        },
      ],
      success_url: `${origin}/?success=true`,
      cancel_url: `${origin}/?canceled=true`,
    });

    // Guardar el pedido en Supabase
    const { error: dbError } = await supabase.from('orders').insert({
      customer_name: customerDetails?.name,
      customer_email: customerDetails?.email,
      customer_phone: customerDetails?.phone,
      shipping_address: customerDetails?.address,
      city: customerDetails?.city,
      postal_code: customerDetails?.postalCode,
      country: customerDetails?.country,
      items: items, // Se guarda como JSONB
      total_amount: subtotal + (shippingCostCents / 100),
      stripe_session_id: session.id,
      status: 'pending',
      user_id: user?.id || null // Vincular con el usuario si existe
    });

    if (dbError) {
      console.error("Error guardando en base de datos:", dbError);
      // Opcional: Podríamos decidir si fallar o continuar
    }

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("ERROR DE STRIPE:", error);
    return new NextResponse(error.message, { status: 500 });
  }
}
