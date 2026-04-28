"use client";

import { useState } from 'react';
import { ShoppingCart, X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useToastStore } from '@/store/useToastStore';
import { useRouter } from 'next/navigation';

export default function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, removeItem, updateQuantity, getCartTotal, clearCart } = useCartStore();
  const addToast = useToastStore(state => state.addToast);
  const router = useRouter();
  
  const subtotal = getCartTotal();
  const specialTotal = useCartStore(state => state.getSpecialTotal());
  const shippingCost = subtotal > 1000 ? 0 : 25;
  const finalTotal = subtotal + shippingCost;
  const savings = subtotal - specialTotal;

  const handleClearCart = () => {
    if (confirm("¿Estás seguro de que quieres vaciar todo el carrito?")) {
      clearCart();
      addToast("CARRITO VACIADO", "info");
    }
  };

  const handleGoToCheckout = () => {
    setIsOpen(false);
    router.push('/checkout');
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="relative p-2 hover:text-primary transition-colors group"
      >
        <ShoppingCart className="group-hover:scale-110 transition-transform" />
        {items.length > 0 && (
          <span className="absolute top-0 right-0 -translate-y-1 translate-x-1 bg-primary text-black text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {items.reduce((acc, item) => acc + item.quantity, 0)}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-black border-l border-primary/20 shadow-[0_0_50px_rgba(0,0,0,1)] transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) z-[101] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-8 border-b border-gray-900">
            <h2 className="font-orbitron text-xl font-black flex items-center gap-3 tracking-tighter">
              <span className="w-2 h-8 bg-primary block"></span> MI CARRITO
            </h2>
            <button onClick={() => setIsOpen(false)} className="w-10 h-10 flex items-center justify-center border border-gray-800 hover:border-primary hover:text-primary transition-all rounded-full">
              <X size={20} />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6 custom-scrollbar">
            {items.length > 0 && (
              <div className="flex justify-end">
                <button 
                  onClick={handleClearCart}
                  className="text-[9px] font-black text-gray-600 hover:text-red-500 transition-colors flex items-center gap-2 uppercase tracking-widest"
                >
                  <Trash2 size={12} /> Vaciar Carrito
                </button>
              </div>
            )}
            
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-700">
                <ShoppingCart size={64} className="mb-6 opacity-10" />
                <p className="font-orbitron text-xs tracking-widest font-bold">TU CARRITO ESTÁ VACÍO</p>
                <button onClick={() => setIsOpen(false)} className="mt-4 text-primary text-[10px] underline font-bold uppercase">Ir a comprar ahora</button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="group flex gap-5 border border-gray-900 p-4 bg-secondary/5 hover:border-gray-700 transition-all relative overflow-hidden">
                  <div className="w-20 h-20 bg-black flex items-center justify-center overflow-hidden shrink-0 border border-gray-800">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-tight text-gray-200 line-clamp-1">{item.name}</h4>
                      <p className="text-primary font-orbitron font-black text-sm mt-1">${item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-gray-800 bg-black">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:text-primary hover:bg-gray-900 transition-colors border-r border-gray-800 text-xs">-</button>
                        <span className="px-4 font-bold text-[10px]">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:text-primary hover:bg-gray-900 transition-colors border-l border-gray-800 text-xs">+</button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-gray-600 hover:text-red-500 transition-colors">
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
            <div className="border-t border-gray-900 p-8 bg-black">
              <div className="space-y-3 mb-8">
                <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 uppercase">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 uppercase">
                  <span>Envío</span>
                  <span className={shippingCost === 0 ? "text-green-500" : ""}>
                    {shippingCost === 0 ? "GRATIS" : `$${shippingCost.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex items-center justify-between py-4 border-y border-gray-900 mt-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-primary font-black uppercase italic">Precio Especial</span>
                    <span className="text-[9px] text-gray-600 font-bold uppercase">(Transferencia / Efectivo)</span>
                  </div>
                  <span className="font-orbitron text-3xl font-black text-primary">
                    ${(specialTotal + shippingCost).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-center">
                  <span className="text-[10px] text-green-500 font-bold bg-green-500/10 px-3 py-1 rounded-full animate-bounce">
                    ¡AHORRAS DE AL CONTADO: ${savings.toLocaleString()}!
                  </span>
                </div>
              </div>

              <button 
                onClick={handleGoToCheckout}
                className="w-full bg-primary text-black font-black py-5 hover:bg-white transition-all uppercase tracking-widest text-xs shadow-[0_0_30px_rgba(0,240,255,0.2)] active:scale-[0.98]"
              >
                FINALIZAR COMPRA
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
