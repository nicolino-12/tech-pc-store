"use client";

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, CreditCard } from 'lucide-react';
import Navbar from '@/components/Navbar';
import CheckoutForm, { CheckoutData } from '@/components/CheckoutForm';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function CheckoutPage() {
  const { items, getCartTotal } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');

  const validateCoupon = async () => {
    setCouponError('');
    const supabase = createClient();
    const { data: coupon } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponCode.toUpperCase())
      .eq('active', true)
      .single();

    if (coupon) {
      setDiscount(coupon.discount_percent);
      alert(`¡Cupón aplicado! Descuento del ${coupon.discount_percent}%`);
    } else {
      setDiscount(0);
      setCouponError('Cupón inválido o expirado');
    }
  };

  if (!isMounted) return null;

  if (items.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-8">
        <ShoppingCart size={64} className="text-gray-800 mb-6" />
        <h1 className="font-orbitron text-2xl mb-4">TU CARRITO ESTÁ VACÍO</h1>
        <button 
          onClick={() => router.push('/')}
          className="bg-primary text-black px-8 py-3 font-bold hover:bg-white transition-colors"
        >
          VOLVER A LA TIENDA
        </button>
      </main>
    );
  }

  const subtotal = getCartTotal();
  const discountAmount = (subtotal * discount) / 100;
  const shippingCost = subtotal > 1000 ? 0 : 25;
  const finalTotal = subtotal - discountAmount + shippingCost;

  const handleCheckout = async (customerData: CheckoutData) => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items,
          customerDetails: customerData 
        }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error in checkout:', error);
      alert('Hubo un error al procesar el pago.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto pt-32 pb-20 px-4 md:px-8">
        <button 
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-8 font-orbitron text-sm"
        >
          <ArrowLeft size={16} /> VOLVER A LA TIENDA
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Formulario */}
          <div className="lg:col-span-7 bg-secondary/20 border border-gray-800 p-8 shadow-2xl shadow-primary/5">
            <h2 className="font-orbitron text-2xl font-bold mb-8 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary text-black rounded-full flex items-center justify-center text-sm">1</span>
              DATOS DEL CLIENTE
            </h2>
            <CheckoutForm 
              onSubmit={handleCheckout} 
              onBack={() => router.push('/')} 
              isLoading={isProcessing} 
            />
          </div>

          {/* Resumen */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-secondary/20 border border-gray-800 p-8 shadow-2xl shadow-primary/5">
              <h2 className="font-orbitron text-2xl font-bold mb-8 flex items-center gap-3 text-primary">
                <span className="w-8 h-8 bg-primary text-black rounded-full flex items-center justify-center text-sm">2</span>
                RESUMEN DE COMPRA
              </h2>
              
              <div className="space-y-4 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 bg-black/40 border border-gray-800">
                    <div className="w-16 h-16 bg-black border border-gray-800 shrink-0 overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-orbitron text-gray-600">
                          {item.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm truncate">{item.name}</h4>
                      <p className="text-gray-500 text-xs">Cantidad: {item.quantity}</p>
                      <p className="text-primary font-orbitron text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-gray-800 pt-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-orbitron">${subtotal.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-500 text-sm">
                    <span>Descuento ({discount}%)</span>
                    <span className="font-orbitron">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-400">
                  <span className="flex items-center gap-2">
                    <Truck size={14} /> Envío
                  </span>
                  <span className="font-orbitron">
                    {shippingCost === 0 ? <span className="text-green-500">GRATIS</span> : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>

                {/* Cupón Input */}
                <div className="pt-4 pb-2">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="CUPÓN" 
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 bg-black/50 border border-gray-800 px-3 py-2 text-xs focus:border-primary outline-none uppercase"
                    />
                    <button 
                      onClick={validateCoupon}
                      className="bg-secondary px-4 py-2 text-[10px] font-bold border border-gray-700 hover:border-primary transition-colors"
                    >
                      APLICAR
                    </button>
                  </div>
                  {couponError && <p className="text-[10px] text-red-500 mt-1 uppercase font-bold">{couponError}</p>}
                </div>

                <div className="flex justify-between text-xl font-bold pt-4 border-t border-gray-800">
                  <span className="font-orbitron tracking-tighter">TOTAL</span>
                  <span className="text-primary font-orbitron">${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Confianza */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-gray-800 bg-black/40 flex flex-col items-center text-center">
                <ShieldCheck className="text-primary mb-2" size={24} />
                <p className="text-[10px] uppercase font-bold text-gray-500">Compra Segura</p>
              </div>
              <div className="p-4 border border-gray-800 bg-black/40 flex flex-col items-center text-center">
                <CreditCard className="text-primary mb-2" size={24} />
                <p className="text-[10px] uppercase font-bold text-gray-500">Pago Encriptado</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
