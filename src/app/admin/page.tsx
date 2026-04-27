import { addProduct } from './actions'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

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

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-2xl justify-center mx-auto min-h-screen pt-20 pb-20">
      <h1 className="text-3xl font-orbitron font-bold text-center mb-2 text-primary">PANEL DE CONTROL</h1>
      
      <div className="flex justify-center gap-6 mb-8 border-b border-gray-800">
        <a href="/admin" className="text-[10px] font-bold pb-4 border-b-2 border-primary text-primary uppercase tracking-widest">
          PRODUCTOS
        </a>
        <a href="/admin/orders" className="text-[10px] font-bold pb-4 border-b-2 border-transparent text-gray-500 hover:text-white transition-colors uppercase tracking-widest">
          PEDIDOS
        </a>
        <a href="/admin/analytics" className="text-[10px] font-bold pb-4 border-b-2 border-transparent text-gray-500 hover:text-white transition-colors uppercase tracking-widest">
          ESTADÍSTICAS
        </a>
      </div>

      <p className="text-gray-400 text-center mb-8">Agrega nuevos componentes al catálogo de la tienda</p>
      
      <form action={addProduct} className="flex-1 flex flex-col w-full gap-4 text-foreground bg-black/50 p-8 border border-gray-800 shadow-2xl shadow-primary/5">
        
        {searchParams?.success && (
          <div className="bg-primary/10 border border-primary text-primary p-4 text-center font-bold mb-4 animate-in fade-in">
            ¡Producto publicado exitosamente en la tienda!
          </div>
        )}
        
        {searchParams?.error && (
          <div className="bg-red-900/20 border border-red-500 text-red-500 p-4 text-center font-bold mb-4">
            Error: {searchParams.error}
          </div>
        )}

        <div>
          <label className="text-sm font-bold text-gray-300 block mb-2">Nombre del producto</label>
          <input className="w-full rounded-none px-4 py-3 bg-secondary/30 border border-gray-700 focus:border-primary focus:outline-none transition-colors" name="name" required placeholder="Ej. Monitor Ultrawide 34 pulgadas" />
        </div>

        <div>
          <label className="text-sm font-bold text-gray-300 block mb-2">Descripción (Corta)</label>
          <textarea className="w-full rounded-none px-4 py-3 bg-secondary/30 border border-gray-700 focus:border-primary focus:outline-none transition-colors" name="description" required rows={3} placeholder="Detalles increíbles del producto..." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold text-gray-300 block mb-2">Precio ($ USD)</label>
            <input className="w-full rounded-none px-4 py-3 bg-secondary/30 border border-gray-700 focus:border-primary focus:outline-none transition-colors" name="price" type="number" step="0.01" required placeholder="999.99" />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-300 block mb-2">Categoría</label>
            <select className="w-full rounded-none px-4 py-3 bg-secondary/30 border border-gray-700 focus:border-primary focus:outline-none transition-colors appearance-none" name="category" required>
              <option value="Procesadores">Procesadores</option>
              <option value="Gráficas">Tarjetas Gráficas</option>
              <option value="Periféricos">Periféricos</option>
              <option value="Almacenamiento">Almacenamiento</option>
              <option value="Memorias">Memorias RAM</option>
              <option value="Monitores">Monitores</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold text-gray-300 block mb-2">Marca</label>
            <input className="w-full rounded-none px-4 py-3 bg-secondary/30 border border-gray-700 focus:border-primary focus:outline-none transition-colors" name="brand" required placeholder="Ej. ASUS, NVIDIA, INTEL" />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-300 block mb-2">Stock Inicial</label>
            <input className="w-full rounded-none px-4 py-3 bg-secondary/30 border border-gray-700 focus:border-primary focus:outline-none transition-colors" name="stock" type="number" required placeholder="10" />
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-gray-300 block mb-2">URL de la Imagen</label>
          <input className="w-full rounded-none px-4 py-3 bg-secondary/30 border border-gray-700 focus:border-primary focus:outline-none transition-colors" name="image" type="url" required placeholder="https://..." />
        </div>
        
        <button type="submit" className="mt-6 bg-primary text-black font-bold py-4 px-4 rounded-none hover:bg-white transition-all tracking-wider">
          PUBLICAR PRODUCTO
        </button>
      </form>
    </div>
  )
}
