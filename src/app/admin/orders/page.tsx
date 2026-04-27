import { createClient } from '@/utils/supabase/server';
import { Package, User, MapPin, Calendar, CreditCard, ExternalLink } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const supabase = createClient();
  
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="pt-32 px-8 text-center">
        <h1 className="text-red-500 font-bold">Error al cargar pedidos</h1>
        <p className="text-gray-400">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col w-full px-4 md:px-8 max-w-7xl mx-auto min-h-screen pt-24 pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-orbitron font-bold text-primary">PEDIDOS RECIBIDOS</h1>
          <p className="text-gray-400">Gestiona las compras realizadas en la tienda</p>
        </div>
        <div className="bg-black/50 border border-gray-800 p-4 rounded-none">
          <span className="text-gray-500 text-sm block">Total de Pedidos</span>
          <span className="text-2xl font-orbitron font-bold text-white">{orders?.length || 0}</span>
        </div>
      </div>

      <div className="grid gap-6">
        {orders?.length === 0 ? (
          <div className="border border-gray-800 p-20 text-center bg-black/20">
            <Package size={48} className="mx-auto mb-4 text-gray-700" />
            <p className="text-gray-500 font-orbitron">No hay pedidos registrados aún</p>
          </div>
        ) : (
          orders?.map((order) => (
            <div 
              key={order.id} 
              className="bg-black/40 border border-gray-800 hover:border-primary/30 transition-all p-6 group"
            >
              <div className="flex flex-col lg:flex-row justify-between gap-8">
                {/* Info Cliente */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2 text-primary font-orbitron text-sm mb-2">
                    <Calendar size={14} />
                    {new Date(order.created_at).toLocaleDateString('es-ES', { 
                      day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                    })}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Cliente</label>
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-400" />
                        <span className="font-bold">{order.customer_name}</span>
                      </div>
                      <div className="text-sm text-gray-400 pl-6">{order.customer_email}</div>
                      <div className="text-sm text-gray-400 pl-6">{order.customer_phone}</div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Entrega</label>
                      <div className="flex items-start gap-2">
                        <MapPin size={16} className="text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm">{order.shipping_address}</p>
                          <p className="text-xs text-gray-400">{order.city}, {order.country} ({order.postal_code})</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Productos */}
                <div className="flex-1 border-t lg:border-t-0 lg:border-l border-gray-800 lg:pl-8 pt-6 lg:pt-0">
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block mb-4">Productos</label>
                  <div className="space-y-3">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center bg-black/20 p-2 border border-gray-900">
                        <div className="text-sm">
                          <span className="text-primary font-orbitron mr-2">x{item.quantity}</span>
                          {item.name}
                        </div>
                        <div className="text-xs font-orbitron text-gray-400">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status & Total */}
                <div className="lg:w-48 flex flex-col justify-between items-end">
                  <div className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest border ${
                    order.status === 'pending' ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500' : 'bg-green-500/10 border-green-500 text-green-500'
                  }`}>
                    {order.status === 'pending' ? 'Pendiente de Pago' : 'Pagado'}
                  </div>
                  
                  <div className="text-right mt-6">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Total del Pedido</div>
                    <div className="text-3xl font-orbitron font-bold text-primary">${Number(order.total_amount).toFixed(2)}</div>
                  </div>

                  {order.stripe_session_id && (
                    <a 
                      href={`https://dashboard.stripe.com/payments`} // Simplificado, idealmente link directo
                      target="_blank"
                      className="mt-4 text-[10px] text-gray-500 flex items-center gap-1 hover:text-white transition-colors"
                    >
                      VER EN STRIPE <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
