"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { useCartStore, Product } from "@/store/useCartStore";
import { useToastStore } from "@/store/useToastStore";

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((state) => state.addItem);
  const addToast = useToastStore((state) => state.addToast);

  // Filtramos solo algunos para destacar (ej: los más caros o aleatorios)
  const featured = products.slice(0, 10);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="font-orbitron text-2xl md:text-3xl font-black text-white italic tracking-tighter uppercase">
            Ofertas <span className="text-primary">Destacadas</span>
          </h2>
          <div className="w-20 h-1 bg-primary mt-2"></div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => scroll("left")} className="w-10 h-10 border border-gray-800 flex items-center justify-center hover:border-primary hover:text-primary transition-all rounded-full">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => scroll("right")} className="w-10 h-10 border border-gray-800 flex items-center justify-center hover:border-primary hover:text-primary transition-all rounded-full">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-10"
      >
        {featured.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ y: -10 }}
            className="min-w-[280px] md:min-w-[320px] bg-secondary/5 border border-gray-900 p-5 snap-start group relative overflow-hidden"
          >
            <div className="absolute top-4 right-4 bg-primary text-black text-[10px] font-black px-2 py-1 uppercase italic z-10">
              Hot Sale
            </div>
            
            <div className="w-full h-48 bg-black mb-6 flex items-center justify-center border border-gray-800 overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500" 
              />
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{(product as any).brand || 'Tech Brand'}</h4>
              <h3 className="font-black text-sm text-white line-clamp-2 h-10 uppercase tracking-tight leading-tight">{product.name}</h3>
              
              <div className="pt-4 border-t border-gray-900 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase italic">Precio Especial</p>
                  <p className="font-orbitron font-black text-xl text-primary">${(product.price * 0.85).toLocaleString()}</p>
                </div>
                <button 
                  onClick={() => {
                    addItem(product);
                    addToast("PRODUCTO AÑADIDO", "success");
                  }}
                  className="w-10 h-10 bg-white text-black flex items-center justify-center hover:bg-primary transition-all"
                >
                  <ShoppingCart size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
