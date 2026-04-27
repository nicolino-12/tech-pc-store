"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell, PieChart, Pie } from 'recharts';
import { TrendingUp, DollarSign, ShoppingBag, Users, ArrowUpRight } from 'lucide-react';

const COLORS = ['#00f0ff', '#7000ff', '#ff00c8', '#00ff9d', '#ff9d00'];

export default function AnalyticsDashboard({ stats }: { stats: any }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Resumen de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Ingresos Totales', value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-primary' },
          { label: 'Pedidos Totales', value: stats.totalOrders, icon: ShoppingBag, color: 'text-purple-500' },
          { label: 'Ticket Promedio', value: `$${(stats.totalRevenue / (stats.totalOrders || 1)).toFixed(2)}`, icon: TrendingUp, color: 'text-green-500' },
          { label: 'Clientes Registrados', value: stats.totalUsers, icon: Users, color: 'text-orange-500' },
        ].map((item, i) => (
          <div key={i} className="bg-secondary/10 border border-gray-800 p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <item.icon size={64} />
            </div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{item.label}</p>
            <div className="flex items-baseline gap-2">
              <h3 className={`text-2xl font-orbitron font-black ${item.color}`}>{item.value}</h3>
              <span className="text-[10px] text-green-500 flex items-center gap-0.5"><ArrowUpRight size={10} /> +12%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Ventas Semanales */}
        <div className="bg-secondary/10 border border-gray-800 p-8">
          <h3 className="font-orbitron font-bold text-sm mb-8 uppercase tracking-widest text-gray-400">Ventas por Categoría</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.salesByCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="name" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #333', fontSize: '12px', fontFamily: 'Orbitron' }}
                  itemStyle={{ color: '#00f0ff' }}
                />
                <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                  {stats.salesByCategory.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Pedidos Recientes */}
        <div className="bg-secondary/10 border border-gray-800 p-8">
          <h3 className="font-orbitron font-bold text-sm mb-8 uppercase tracking-widest text-gray-400">Tendencia de Pedidos</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.ordersTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="date" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #333', fontSize: '12px', fontFamily: 'Orbitron' }}
                />
                <Line type="monotone" dataKey="orders" stroke="#00f0ff" strokeWidth={3} dot={{ fill: '#00f0ff', r: 4 }} activeDot={{ r: 6, stroke: '#fff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
