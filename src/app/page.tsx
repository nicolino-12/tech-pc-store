import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BannerCarousel from "@/components/BannerCarousel";
import BrandCarousel from "@/components/BrandCarousel";
import FeaturedProducts from "@/components/FeaturedProducts";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import { createClient } from "@/utils/supabase/server";
import { Suspense } from "react";
import CheckoutStatus from "@/components/CheckoutStatus";
import { Product } from "@/store/useCartStore";

async function getProducts(): Promise<Product[]> {
  const supabase = createClient();
  const { data: products, error } = await supabase.from('products').select('*');
  if (error) {
    console.error('Error al cargar productos:', error);
    return [];
  }
  return products || [];
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="flex min-h-screen flex-col bg-black">
      <Navbar />
      
      <Suspense fallback={null}>
        <CheckoutStatus />
      </Suspense>

      {/* Hero Principal */}
      <Hero />

      {/* Carrusel de Banners Promocionales */}
      <BannerCarousel />

      {/* Carrusel de Productos Destacados */}
      <FeaturedProducts products={products} />

      {/* Carrusel de Marcas */}
      <BrandCarousel />

      {/* Catálogo (limitado a 8 + Ver Todo) */}
      <Suspense fallback={<div className="py-20 text-center font-orbitron text-xs animate-pulse text-gray-600 uppercase tracking-widest">Cargando Catálogo...</div>}>
        <ProductGrid products={products || []} />
      </Suspense>

      <Footer />
    </main>
  );
}
