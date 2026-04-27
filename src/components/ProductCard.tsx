"use client";

import { useCartStore, Product } from '@/store/useCartStore';
import { ShoppingCart } from 'lucide-react';

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="group border border-gray-800 bg-secondary/20 p-4 hover:border-primary transition-all cursor-pointer flex flex-col h-full">
      <div className="aspect-square bg-black mb-4 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {product.image ? (
          <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        ) : (
          <span className="text-gray-600 font-orbitron">{product.name.charAt(0)}</span>
        )}
      </div>
      <div className="flex-grow">
        <h4 className="font-bold text-lg mb-2 truncate">{product.name}</h4>
        <p className="text-gray-400 text-sm line-clamp-2 mb-4">{product.description}</p>
      </div>
      <div>
        <p className="text-primary font-orbitron text-xl mb-4">${product.price.toFixed(2)}</p>
        <button 
          onClick={() => addItem(product)}
          className="w-full py-2 flex items-center justify-center gap-2 border border-gray-600 hover:border-primary hover:text-primary transition-colors"
        >
          <ShoppingCart size={18} />
          <span>AGREGAR</span>
        </button>
      </div>
    </div>
  );
}
