import { createClient } from '@/utils/supabase/server';
import { Package, User, MapPin, Calendar, CreditCard, ExternalLink, TrendingUp, DollarSign, ShoppingBag } from 'lucide-react';
import StatusSelector from './StatusSelector';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login?message=Inicia sesión para acceder al panel')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/?message=No tienes permisos para acceder al panel de administración')
  }
  
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

  // Cálculos de estadísticas
  const totalRevenue = orders?.reduce((acc, order) => 
    order.status !== 'cancelled' ? acc + Number(order.total_amount) : acc, 0) || 0;
  const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0;
  const paidOrders = orders?.filter(o => o.status === 'paid').length || 0;

  return (
    <div className="flex-1 flex flex-col w-full px-4 md:px-8 max-w-7xl mx-auto min-h-screen pt-24 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-orbitron font-bold text-primary">PEDIDOS RECIBIDOS</h1>
        <p className="text-gray-400">Gestiona las compras realizadas en la tienda</p>
      </div>

      <div className="flex gap-6 mb-8 border-b border-gray-800">
        <a href="/admin" className="text-[10px] font-bold pb-4 border-b-2 border-transparent text-gray-500 hover:text-white transition-colors uppercase tracking-widest">
          PRODUCTOS
        </a>
        <a href="/admin/orders" className="text-[10px] font-bold pb-4 border-b-2 border-primary text-primary uppercase tracking-widest">
          PEDIDOS
        </a>
        <a href="/admin/analytics" className="text-[10px] font-bold pb-4 border-b-2 border-transparent text-gray-500 hover:text-white transition-colors uppercase tracking-widest">
          ESTADÍSTICAS
        </a>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-black/40 border border-gray-800 p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Ingresos Totales</p>
            <p className="text-2xl font-orbitron font-bold">${totalRevenue.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-black/40 border border-gray-800 p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-500/10 flex items-center justify-center text-yellow-500 border border-yellow-500/20">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Pendientes</p>
            <p className="text-2xl font-orbitron font-bold">{pendingOrders}</p>
          </div>
        </div>
        <div className="bg-black/40 border border-gray-800 p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Pagados</p>
            <p className="text-2xl font-orbitron font-bold">{paidOrders}</p>
          </div>
        </div>
        <div className="bg-black/40 border border-gray-800 p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
            <Package size={24} />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Total Pedidos</p>
            <p className="text-2xl font-orbitron font-bold">{orders?.length || 0}</p>
          </div>
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
                  <StatusSelector orderId={order.id} currentStatus={order.status} />
                  
                  <div className="text-right mt-6">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Total del Pedido</div>
                    <div className="text-3xl font-orbitron font-bold text-primary">${Number(order.total_amount).toFixed(2)}</div>
                  </div>

                  {order.stripe_session_id && (
                    <a 
                      href={`https://dashboard.stripe.com/payments`} 
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
