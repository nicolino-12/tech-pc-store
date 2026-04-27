"use client";

import { useCartStore, Product } from '@/store/useCartStore';
import { ShoppingCart, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function ProductCard({ product }: { product: Product & { brand?: string, stock?: number } }) {
  const addItem = useCartStore((state) => state.addItem);

  const isOutOfStock = product.stock !== undefined && product.stock <= 0;

  return (
    <div className="group border border-gray-800 bg-secondary/20 p-4 hover:border-primary transition-all flex flex-col h-full relative">
      <Link href={`/product/${product.id}`} className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity text-primary">
        <ExternalLink size={18} />
      </Link>

      <Link href={`/product/${product.id}`} className="flex-grow flex flex-col">
        <div className="aspect-square bg-black mb-4 relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          {product.image ? (
            <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          ) : (
            <span className="text-gray-600 font-orbitron">{product.name.charAt(0)}</span>
          )}
          
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-red-500 font-orbitron font-bold text-xs border border-red-500 px-2 py-1 rotate-[-10deg] tracking-widest">OUT OF STOCK</span>
            </div>
          )}
        </div>
        
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{product.brand || 'TECH_PC'}</span>
            {product.stock !== undefined && product.stock > 0 && product.stock < 5 && (
              <span className="text-[8px] font-bold text-orange-500 uppercase">Últimas unidades!</span>
            )}
          </div>
          <h4 className="font-bold text-lg mb-2 truncate group-hover:text-primary transition-colors">{product.name}</h4>
          <p className="text-gray-400 text-xs line-clamp-2 mb-4">{product.description}</p>
        </div>
      </Link>

      <div className="mt-auto pt-4 border-t border-gray-800/50">
        <p className="text-primary font-orbitron text-xl mb-4">${product.price.toFixed(2)}</p>
        <button 
          onClick={(e) => {
            e.preventDefault();
            if (!isOutOfStock) addItem(product);
          }}
          disabled={isOutOfStock}
          className={`w-full py-2 flex items-center justify-center gap-2 border transition-all ${
            isOutOfStock 
            ? "border-gray-800 text-gray-600 cursor-not-allowed" 
            : "border-gray-700 hover:bg-primary hover:border-primary hover:text-black"
          }`}
        >
          <ShoppingCart size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">
            {isOutOfStock ? 'SIN STOCK' : 'COMPRAR'}
          </span>
        </button>
      </div>
    </div>
  );
}
