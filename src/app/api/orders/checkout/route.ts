import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

export async function POST(req: Request) {
  try {
    const { items } = await req.json();
    
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
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'ES', 'MX', 'AR', 'CL'], // Agregué varios países, puedes ajustarlos
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

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("ERROR DE STRIPE:", error);
    return new NextResponse(error.message, { status: 500 });
  }
}
