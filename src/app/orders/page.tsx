import { createClient } from '@/utils/supabase/server';
import { Package, MapPin, Calendar, Clock, ShoppingBag, ArrowLeft } from 'lucide-react';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function MyOrdersPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login?message=Inicia sesión para ver tu historial de pedidos');
  }

  const { data: orders, error } = await supabase
    .from('orders')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="pt-32 px-8 text-center bg-black min-h-screen text-white">
        <h1 className="text-red-500 font-bold">Error al cargar tus pedidos</h1>
        <p className="text-gray-400">{error.message}</p>
      </div>
    );
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending': return 'border-yellow-500 text-yellow-500 bg-yellow-500/10';
      case 'paid': return 'border-green-500 text-green-500 bg-green-500/10';
      case 'shipped': return 'border-blue-500 text-blue-500 bg-blue-500/10';
      case 'delivered': return 'border-purple-500 text-purple-500 bg-purple-500/10';
      case 'cancelled': return 'border-red-500 text-red-500 bg-red-500/10';
      default: return 'border-gray-500 text-gray-500 bg-gray-500/10';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'paid': return 'Pagado';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="max-w-5xl mx-auto pt-32 pb-20 px-4 md:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-orbitron font-black text-primary tracking-tighter">MIS PEDIDOS</h1>
            <p className="text-gray-500 uppercase tracking-widest text-[10px] font-bold mt-2">Historial de adquisiciones tecnológicas</p>
          </div>
          <Link 
            href="/" 
            className="hidden md:flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-xs font-bold font-orbitron"
          >
            <ArrowLeft size={16} /> VOLVER A LA TIENDA
          </Link>
        </div>

        {orders?.length === 0 ? (
          <div className="border border-gray-800 p-20 text-center bg-secondary/10 flex flex-col items-center">
            <ShoppingBag size={64} className="text-gray-800 mb-6" />
            <h2 className="font-orbitron text-xl mb-4">AÚN NO HAS REALIZADO COMPRAS</h2>
            <p className="text-gray-500 mb-8 max-w-sm">Explora nuestro catálogo y arma tu setup definitivo hoy mismo.</p>
            <Link 
              href="/#catalogo"
              className="bg-primary text-black px-10 py-4 font-black tracking-widest hover:bg-white transition-all"
            >
              EXPLORAR CATÁLOGO
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders?.map((order) => (
              <div 
                key={order.id} 
                className="bg-secondary/10 border border-gray-800 p-6 md:p-8 relative overflow-hidden group hover:border-primary/30 transition-all"
              >
                {/* Status Badge */}
                <div className={`absolute top-0 right-0 px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] border-l border-b ${getStatusStyle(order.status)}`}>
                  {getStatusLabel(order.status)}
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                  {/* Info Principal */}
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 border border-primary/20">
                        <Package size={24} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">ID del Pedido</p>
                        <p className="font-orbitron text-sm">#{order.id.slice(0, 8).toUpperCase()}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="flex items-start gap-3">
                        <Calendar size={16} className="text-gray-600 mt-0.5" />
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase font-bold">Fecha</p>
                          <p className="text-xs">{new Date(order.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin size={16} className="text-gray-600 mt-0.5" />
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase font-bold">Envío a</p>
                          <p className="text-xs truncate max-w-[200px]">{order.shipping_address}, {order.city}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Productos resumidos */}
                  <div className="md:w-64 space-y-4 border-t md:border-t-0 md:border-l border-gray-800 pt-6 md:pt-0 md:pl-8">
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-4">Artículos</p>
                    <div className="space-y-2">
                      {order.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-xs">
                          <span className="text-gray-400"><span className="text-primary font-orbitron mr-1">x{item.quantity}</span> {item.name}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-4 mt-4 border-t border-gray-800">
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Inversión Total</p>
                      <p className="text-2xl font-orbitron font-black text-primary">${Number(order.total_amount).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
