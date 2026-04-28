import { addProduct } from './actions'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import DeleteProductButton from './DeleteProductButton'

export const dynamic = 'force-dynamic';

export default async function AdminPage({ searchParams }: { searchParams: { success?: string, error?: string } }) {
  const supabase = createClient()
  
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

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="flex-1 flex flex-col w-full px-4 md:px-8 max-w-6xl mx-auto min-h-screen pt-24 pb-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-orbitron font-black text-white tracking-tighter italic">PANEL DE CONTROL</h1>
        <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mt-2">Gestión de Inventario Elite</p>
      </div>
      
      <div className="flex justify-center gap-10 mb-12 border-b border-gray-900">
        <a href="/admin" className="text-[11px] font-black pb-4 border-b-2 border-primary text-primary uppercase tracking-widest">
          PRODUCTOS
        </a>
        <a href="/admin/orders" className="text-[11px] font-black pb-4 border-b-2 border-transparent text-gray-600 hover:text-white transition-all uppercase tracking-widest">
          PEDIDOS
        </a>
        <a href="/admin/analytics" className="text-[11px] font-black pb-4 border-b-2 border-transparent text-gray-600 hover:text-white transition-all uppercase tracking-widest">
          ESTADÍSTICAS
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Formulario */}
        <div className="space-y-6">
          <h2 className="font-orbitron text-lg font-black text-white mb-6 flex items-center gap-3">
            <span className="w-2 h-6 bg-primary block"></span> NUEVO PRODUCTO
          </h2>
          
          <form action={addProduct} className="flex flex-col gap-5 bg-secondary/5 p-8 border border-gray-900 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <span className="font-orbitron text-4xl font-black">ADD</span>
            </div>

            {searchParams?.success && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-500 p-4 text-[11px] font-bold uppercase tracking-widest text-center animate-pulse">
                ¡Producto publicado con éxito!
              </div>
            )}
            
            {searchParams?.error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 text-[11px] font-bold uppercase tracking-widest text-center">
                Error: {searchParams.error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Nombre</label>
                <input className="w-full bg-black border border-gray-800 p-3 text-sm focus:border-primary transition-colors outline-none" name="name" required placeholder="RTX 4090 OC Edition" />
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Descripción</label>
                <textarea className="w-full bg-black border border-gray-800 p-3 text-sm focus:border-primary transition-colors outline-none" name="description" required rows={2} placeholder="Descripción técnica..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Precio ($)</label>
                  <input className="w-full bg-black border border-gray-800 p-3 text-sm focus:border-primary transition-colors outline-none" name="price" type="number" step="0.01" required />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Categoría</label>
                  <select className="w-full bg-black border border-gray-800 p-3 text-sm focus:border-primary transition-colors outline-none appearance-none" name="category" required>
                    <option value="Procesadores">Procesadores</option>
                    <option value="Motherboards">Placas Madre</option>
                    <option value="Gráficas">Gráficas</option>
                    <option value="Memorias">Memorias</option>
                    <option value="Almacenamiento">Almacenamiento</option>
                    <option value="Fuentes">Fuentes</option>
                    <option value="Gabinetes">Gabinetes</option>
                    <option value="Periféricos">Periféricos</option>
                    <option value="Monitores">Monitores</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Marca</label>
                  <input className="w-full bg-black border border-gray-800 p-3 text-sm focus:border-primary transition-colors outline-none" name="brand" required placeholder="ASUS" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Stock</label>
                  <input className="w-full bg-black border border-gray-800 p-3 text-sm focus:border-primary transition-colors outline-none" name="stock" type="number" required />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">URL Imagen</label>
                <input className="w-full bg-black border border-gray-800 p-3 text-sm focus:border-primary transition-colors outline-none" name="image" type="url" required />
              </div>
            </div>
            
            <button type="submit" className="mt-4 bg-primary text-black font-black py-4 text-xs uppercase tracking-[0.2em] hover:bg-white transition-all shadow-[0_0_20px_rgba(0,240,255,0.2)]">
              PUBLICAR PRODUCTO
            </button>
          </form>
        </div>

        {/* Lista de Productos */}
        <div className="space-y-6">
          <h2 className="font-orbitron text-lg font-black text-white mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2 h-6 bg-white block"></span> INVENTARIO ACTUAL
            </div>
            <span className="text-[10px] text-gray-600 font-bold uppercase">{products?.length || 0} ITEMS</span>
          </h2>
          
          <div className="bg-secondary/5 border border-gray-900 max-h-[650px] overflow-y-auto custom-scrollbar p-1">
            {products?.map((p) => (
              <div key={p.id} className="flex items-center gap-4 p-4 border-b border-gray-900 last:border-0 hover:bg-white/5 transition-colors group">
                <img src={p.image} alt={p.name} className="w-12 h-12 object-contain bg-black rounded p-1 border border-gray-800" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-primary uppercase">{p.brand}</p>
                  <h4 className="text-xs font-black text-gray-200 truncate uppercase">{p.name}</h4>
                  <p className="text-[10px] text-gray-500 font-bold">${p.price.toLocaleString()} | {p.stock} Uds.</p>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DeleteProductButton id={p.id} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
