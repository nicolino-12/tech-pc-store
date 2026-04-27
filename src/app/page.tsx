import { ArrowRight, Cpu, Shield, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProductGrid from "@/components/ProductGrid";
import { Product } from "@/store/useCartStore";
import { createClient } from "@/utils/supabase/server";
import { Suspense } from "react";
import CheckoutStatus from "@/components/CheckoutStatus";

async function getProducts(): Promise<Product[]> {
  const supabase = createClient();
  const { data: products, error } = await supabase.from('products').select('*');

  if (error) {
    console.error('Error al cargar productos desde Supabase:', error);
    return [];
  }

  return products || [];
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <Suspense fallback={null}>
        <CheckoutStatus />
      </Suspense>

      {/* Hero Section */}
      <section className="mt-20 pt-32 pb-20 px-8 flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full -z-10" />
        <h1 className="font-orbitron text-6xl md:text-8xl font-black mb-6 tracking-tighter uppercase">
          El Futuro del <br />
          <span className="text-gradient">Gaming</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10">
          Arma tu setup definitivo con los componentes más avanzados del mercado. 
          Rendimiento extremo para creadores y jugadores exigentes.
        </p>
        <a 
          href="#catalogo"
          className="bg-primary text-black font-bold text-lg px-8 py-4 rounded-none border border-primary hover:bg-transparent hover:text-primary transition-all flex items-center gap-2 group"
        >
          EXPLORAR CATÁLOGO
          <ArrowRight className="group-hover:translate-x-1 transition-transform" />
        </a>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 py-20 bg-secondary/30">
        <div className="flex flex-col items-center text-center p-8 border border-gray-800 bg-black/40 hover:border-primary/50 transition-colors">
          <Cpu className="w-12 h-12 text-primary mb-4" />
          <h3 className="font-orbitron text-xl font-bold mb-2">Hardware Elite</h3>
          <p className="text-gray-400">Solo trabajamos con las mejores marcas y últimos lanzamientos.</p>
        </div>
        <div className="flex flex-col items-center text-center p-8 border border-gray-800 bg-black/40 hover:border-primary/50 transition-colors">
          <Zap className="w-12 h-12 text-primary mb-4" />
          <h3 className="font-orbitron text-xl font-bold mb-2">Envíos Flash</h3>
          <p className="text-gray-400">Recibe tu equipo en tiempo récord en cualquier parte del país.</p>
        </div>
        <div className="flex flex-col items-center text-center p-8 border border-gray-800 bg-black/40 hover:border-primary/50 transition-colors">
          <Shield className="w-12 h-12 text-primary mb-4" />
          <h3 className="font-orbitron text-xl font-bold mb-2">Garantía Total</h3>
          <p className="text-gray-400">Soporte técnico especializado y garantía extendida en todos los productos.</p>
        </div>
      </section>

      {/* Products Section */}
      <ProductGrid products={products} />

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-8 mt-auto bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-orbitron text-2xl font-bold text-primary">TECH_PC</div>
          <p className="text-gray-500 text-sm">© 2026 Tech PC Store. Todos los derechos reservados.</p>
        </div>
      </footer>
    </main>
  );
}
