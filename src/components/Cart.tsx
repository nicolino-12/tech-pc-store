"use client";

import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { ShoppingCart, X, Minus, Plus, Trash2 } from 'lucide-react';

export default function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, removeItem, updateQuantity, getCartTotal } = useCartStore();
  
  const subtotal = getCartTotal();
  const shippingCost = subtotal > 1000 ? 0 : 25;
  const finalTotal = subtotal + shippingCost;

  const handleCheckout = async () => {
    // Aquí iría la integración con Stripe Checkout
    try {
      const response = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error in checkout:', error);
      alert('Hubo un error al procesar el pago.');
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="relative p-2 hover:text-primary transition-colors"
      >
        <ShoppingCart />
        {items.length > 0 && (
          <span className="absolute top-0 right-0 -translate-y-1 translate-x-1 bg-primary text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {items.reduce((acc, item) => acc + item.quantity, 0)}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[500px] bg-secondary border-l border-gray-800 shadow-2xl shadow-primary/20 transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <h2 className="font-orbitron text-xl font-bold flex items-center gap-2">
              <ShoppingCart className="text-primary" /> MI CARRITO
            </h2>
            <button onClick={() => setIsOpen(false)} className="hover:text-primary transition-colors">
              <X />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <ShoppingCart size={48} className="mb-4 opacity-20" />
                <p>Tu carrito está vacío</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4 border border-gray-800 p-3 bg-black/30">
                  <div className="w-24 h-24 bg-black border border-gray-800 flex items-center justify-center overflow-hidden shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-orbitron text-gray-600">{item.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold truncate">{item.name}</h4>
                      <p className="text-primary font-orbitron">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-gray-700">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 hover:text-primary hover:bg-gray-800 transition-colors"><Minus size={14} /></button>
                        <span className="px-3 font-orbitron text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 hover:text-primary hover:bg-gray-800 transition-colors"><Plus size={14} /></button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-400 p-1">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-800 p-6 bg-black/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Subtotal</span>
                <span className="font-orbitron font-bold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-gray-400">Envío <span className="text-xs ml-1">(Gratis > $1000)</span></span>
                <span className="font-orbitron text-sm">
                  {shippingCost === 0 ? <span className="text-green-500 font-bold tracking-widest">GRATIS</span> : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex items-center justify-between mb-6 pt-4 border-t border-gray-800">
                <span className="text-gray-200 font-bold text-lg">Total a pagar</span>
                <span className="font-orbitron text-3xl font-bold text-primary">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>
              <button 
                onClick={handleCheckout}
                className="w-full bg-primary text-black font-bold py-4 hover:bg-white transition-colors"
              >
                PROCEDER AL PAGO
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
