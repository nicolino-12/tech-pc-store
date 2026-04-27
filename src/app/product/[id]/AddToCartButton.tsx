"use client";

import { useCartStore, Product } from '@/store/useCartStore';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';

export default function AddToCartButton({ product }: { product: Product & { stock?: number } }) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const isOutOfStock = product.stock !== undefined && product.stock <= 0;

  return (
    <button 
      onClick={handleAdd}
      disabled={isOutOfStock || added}
      className={`w-full py-5 font-black tracking-[0.2em] flex items-center justify-center gap-3 transition-all duration-300 ${
        isOutOfStock 
          ? "bg-gray-800 text-gray-500 cursor-not-allowed" 
          : added 
            ? "bg-green-500 text-black" 
            : "bg-primary text-black hover:bg-white active:scale-95"
      }`}
    >
      {isOutOfStock ? (
        "AGOTADO"
      ) : added ? (
        "¡AÑADIDO AL CARRITO!"
      ) : (
        <>
          <ShoppingCart size={20} /> AÑADIR AL SETUP
        </>
      )}
    </button>
  );
}
