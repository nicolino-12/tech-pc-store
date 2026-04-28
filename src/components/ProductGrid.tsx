"use client";

import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";
import { Product } from "@/store/useCartStore";
import { useSearchParams } from "next/navigation";

interface ProductGridProps {
  products: (Product & { category?: string })[];
}

const CATEGORIES = ["Todos", "Procesadores", "Gráficas", "Memorias", "Almacenamiento", "Gabinetes", "Conectividad", "Fuentes", "Periféricos", "Monitores"];

export default function ProductGrid({ products }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search')?.toLowerCase() || "";

  useEffect(() => {
    // Simular carga inicial para mostrar skeletons
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === "Todos" || p.category === activeCategory;
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery) || 
      p.description?.toLowerCase().includes(searchQuery);
    
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="catalogo" className="py-24 px-8 max-w-7xl mx-auto w-full scroll-mt-20">
      <h2 className="font-orbitron text-4xl font-bold mb-4 text-center text-gradient uppercase tracking-tighter">
        Catálogo de Componentes
      </h2>

      {searchQuery && (
        <p className="text-center text-gray-500 mb-8 font-bold text-sm">
          Resultados para: <span className="text-primary">"{searchQuery}"</span>
        </p>
      )}

      {/* Category Menu */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-16">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2 font-orbitron text-xs font-bold transition-all border ${
              activeCategory === cat 
                ? "bg-primary text-black border-primary" 
                : "bg-transparent text-gray-400 border-gray-800 hover:border-gray-600 hover:text-white"
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-700">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full py-20 text-center border border-dashed border-gray-800">
            <p className="text-gray-500 font-orbitron">No hay productos en esta categoría por ahora.</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </section>
  );
}
