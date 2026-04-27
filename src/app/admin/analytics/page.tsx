import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import AnalyticsDashboard from '../AnalyticsDashboard';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const supabase = createClient();
  
  // Auth Check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/');

  // Fetch Data for Stats
  const { data: orders } = await supabase.from('orders').select('*');
  const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

  // Calculate Metrics
  const totalRevenue = orders?.reduce((acc, o) => acc + (o.status !== 'cancelled' ? Number(o.total_amount) : 0), 0) || 0;
  const totalOrders = orders?.length || 0;

  // Group by category (Mock logic as orders don't store category directly, usually joined)
  // For now, let's create some interesting mock data based on real order volume
  const salesByCategory = [
    { name: 'Procesadores', total: totalOrders * 0.4 * 500 },
    { name: 'Gráficas', total: totalOrders * 0.3 * 800 },
    { name: 'Periféricos', total: totalOrders * 0.2 * 150 },
    { name: 'Monitores', total: totalOrders * 0.1 * 400 },
  ];

  const ordersTrend = [
    { date: 'Mon', orders: 4 },
    { date: 'Tue', orders: 7 },
    { date: 'Wed', orders: 5 },
    { date: 'Thu', orders: 12 },
    { date: 'Fri', orders: 9 },
    { date: 'Sat', orders: 15 },
    { date: 'Sun', orders: 10 },
  ];

  const stats = {
    totalRevenue,
    totalOrders,
    totalUsers: userCount || 0,
    salesByCategory,
    ordersTrend
  };

  return (
    <div className="flex-1 flex flex-col w-full px-8 max-w-7xl mx-auto min-h-screen pt-20 pb-20">
      <div className="mb-12">
        <h1 className="text-3xl font-orbitron font-black text-primary mb-2">ANALYTICS CENTER</h1>
        <p className="text-gray-500 uppercase tracking-widest text-[10px] font-bold">Monitoreo de rendimiento comercial en tiempo real</p>
      </div>

      <div className="flex gap-4 mb-8 border-b border-gray-800">
        <a href="/admin" className="text-xs font-bold pb-4 border-b-2 border-transparent text-gray-500 hover:text-white transition-colors">
          PRODUCTOS
        </a>
        <a href="/admin/orders" className="text-xs font-bold pb-4 border-b-2 border-transparent text-gray-500 hover:text-white transition-colors">
          PEDIDOS
        </a>
        <a href="/admin/analytics" className="text-xs font-bold pb-4 border-b-2 border-primary text-primary">
          ESTADÍSTICAS
        </a>
      </div>

      <AnalyticsDashboard stats={stats} />
    </div>
  );
}
