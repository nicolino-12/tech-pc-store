import { createClient } from '@/utils/supabase/server';
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, Cpu, BadgeCheck, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AddToCartButton from './AddToCartButton';
import ReviewForm from './ReviewForm';
import WishlistButton from './WishlistButton';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: product } = await supabase.from('products').select('name, description, image').eq('id', params.id).single();
  
  if (!product) return { title: 'Producto no encontrado' };

  return {
    title: `${product.name} | Tech PC Store`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!product) {
    notFound();
  }

  // Obtener reseñas (simuladas por ahora o desde la tabla si ya hay datos)
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', product.id)
    .order('created_at', { ascending: false });

  const averageRating = reviews && reviews.length > 0 
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length 
    : 0;

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.name,
            "description": product.description,
            "image": product.image,
            "brand": {
              "@type": "Brand",
              "name": product.brand
            },
            "offers": {
              "@type": "Offer",
              "priceCurrency": "USD",
              "price": product.price,
              "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
            }
          })
        }}
      />
      
      <div className="max-w-7xl mx-auto pt-32 pb-20 px-4 md:px-8">
        <Link 
          href="/#catalogo" 
          className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-8 font-orbitron text-xs font-bold"
        >
          <ArrowLeft size={16} /> VOLVER AL CATÁLOGO
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Imagen del Producto */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-600/20 blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-secondary/20 border border-gray-800 p-8 flex items-center justify-center min-h-[400px] md:min-h-[500px]">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="max-w-full max-h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <Cpu size={120} className="text-gray-800" />
              )}
              
              {product.stock <= 0 && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                  <span className="border-2 border-red-500 text-red-500 font-orbitron font-black px-6 py-2 rotate-[-10deg] text-2xl tracking-widest">AGOTADO</span>
                </div>
              )}
            </div>
          </div>

          {/* Información del Producto */}
          <div className="flex flex-col">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 border border-primary/20 tracking-widest uppercase">
                  {product.category}
                </span>
                <span className="text-gray-500 text-[10px] font-bold tracking-widest uppercase flex items-center gap-1">
                  <BadgeCheck size={12} className="text-blue-500" /> {product.brand || 'TECH_PC ELITE'}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-orbitron font-black tracking-tighter mb-4 uppercase leading-none">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < Math.round(averageRating) ? "currentColor" : "none"} />
                  ))}
                  <span className="ml-2 text-gray-400 text-xs">({reviews?.length || 0} reseñas)</span>
                </div>
                <div className="w-px h-4 bg-gray-800"></div>
                <span className={`text-xs font-bold ${product.stock > 3 ? 'text-green-500' : 'text-orange-500'}`}>
                  {product.stock > 0 ? `${product.stock} unidades disponibles` : 'Sin stock'}
                </span>
              </div>

              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                {product.description}
              </p>
            </div>

            <div className="mt-auto space-y-8">
              <div className="flex items-baseline gap-4">
                <span className="text-5xl font-orbitron font-black text-primary tracking-tighter">
                  ${Number(product.price).toFixed(2)}
                </span>
                <span className="text-gray-500 text-sm line-through">${(Number(product.price) * 1.2).toFixed(2)}</span>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <AddToCartButton product={product} />
                </div>
                <WishlistButton productId={product.id} />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-800">
                <div className="flex items-center gap-3">
                  <Truck className="text-primary" size={20} />
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400">Envío Gratis</p>
                    <p className="text-[9px] text-gray-500 leading-tight">En compras superiores a $1000</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-primary" size={20} />
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400">Garantía Oficial</p>
                    <p className="text-[9px] text-gray-500 leading-tight">12 meses de soporte técnico</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reseñas Section */}
        <div className="mt-32 pt-20 border-t border-gray-900">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-orbitron font-black uppercase tracking-tighter">Reseñas de Clientes</h2>
            <ReviewForm productId={product.id} />
          </div>
          
          {reviews && reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-secondary/10 border border-gray-800 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-bold text-sm uppercase">{review.user_name}</p>
                      <div className="flex text-yellow-500 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-600 uppercase font-bold">{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-400 text-sm italic">"{review.comment}"</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-gray-800">
              <p className="text-gray-600 font-orbitron uppercase text-sm">Sé el primero en calificar este producto</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
