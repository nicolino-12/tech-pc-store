"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";

export default function CheckoutStatus() {
  const searchParams = useSearchParams();
  const clearCart = useCartStore((state) => state.clearCart);
  const [message, setMessage] = useState<{ title: string; body: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (searchParams.get("success")) {
      clearCart();
      setMessage({
        title: "¡PAGO EXITOSO!",
        body: "Gracias por tu compra en Tech PC Store. Tu pedido está en camino.",
        type: "success"
      });
      // Limpiamos la URL sin recargar
      window.history.replaceState(null, '', '/');
    }

    if (searchParams.get("canceled")) {
      setMessage({
        title: "PAGO CANCELADO",
        body: "Has cancelado el proceso de pago. Puedes volver a intentarlo cuando gustes.",
        type: "error"
      });
      window.history.replaceState(null, '', '/');
    }
  }, [searchParams, clearCart]);

  if (!message) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[100] max-w-sm animate-in slide-in-from-bottom-5 fade-in duration-500">
      <div className={`p-6 border ${message.type === 'success' ? 'bg-black/90 border-primary' : 'bg-black/90 border-red-500'} shadow-2xl backdrop-blur-md`}>
        <h4 className={`font-orbitron font-bold text-xl mb-2 ${message.type === 'success' ? 'text-primary' : 'text-red-500'}`}>
          {message.title}
        </h4>
        <p className="text-sm text-gray-300">{message.body}</p>
        <button 
          onClick={() => setMessage(null)} 
          className={`mt-6 w-full border border-current py-2 text-sm font-bold transition-colors ${message.type === 'success' ? 'text-primary hover:bg-primary hover:text-black' : 'text-red-500 hover:bg-red-500 hover:text-black'}`}
        >
          CERRAR
        </button>
      </div>
    </div>
  );
}
