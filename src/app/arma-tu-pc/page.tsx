"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Navbar from '@/components/Navbar';
import { Cpu, Layout as MotherboardIcon, HardDrive, Monitor, MousePointer2, CheckCircle2, ChevronRight, ChevronLeft, ShoppingCart, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { motion, AnimatePresence } from 'framer-motion';

export const dynamic = 'force-dynamic';

const STEPS = [
  { id: 'Procesadores', name: 'Procesador', icon: Cpu },
  { id: 'Motherboards', name: 'Placa Madre', icon: MotherboardIcon },
  { id: 'Memorias', name: 'Memoria RAM', icon: MousePointer2 },
  { id: 'Gráficas', name: 'Placa de Video', icon: Monitor },
  { id: 'Almacenamiento', name: 'Disco / SSD', icon: HardDrive },
  { id: 'Gabinetes', name: 'Gabinete', icon: Monitor },
  { id: 'Fuentes', name: 'Fuente', icon: MousePointer2 },
  { id: 'Coolers', name: 'Cooling', icon: MousePointer2 },
];

export default function ArmaTuPC() {
  const [isMounted, setIsMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selections, setSelections] = useState<Record<string, any>>({});
  const addItem = useCartStore((state) => state.addItem);
  const supabase = createClient();

  useEffect(() => {
    setIsMounted(true);
    async function fetchProducts() {
      setLoading(true);
      const { data } = await supabase.from('products').select('*');
      setProducts(data || []);
      setLoading(false);
    }
    fetchProducts();
  }, [supabase]);

  if (!isMounted) return null;

  const currentCategory = STEPS[currentStep].id;
  const filteredProducts = products.filter(p => {
    // Si la categoría es Motherboards, buscamos en 'Memorias' o 'Motherboards' dependiendo de cómo se guardaron
    if (currentCategory === 'Motherboards') {
      return p.category === 'Motherboards' || p.name.toLowerCase().includes('placa base') || p.name.toLowerCase().includes('motherboard');
    }
    return p.category === currentCategory;
  });

  const handleSelect = (product: any) => {
    setSelections(prev => ({ ...prev, [currentCategory]: product }));
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const removeSelection = (categoryId: string) => {
    const newSelections = { ...selections };
    delete newSelections[categoryId];
    setSelections(newSelections);
  };

  const total = Object.values(selections).reduce((acc, p) => acc + Number(p.price), 0);

  const addAllToCart = () => {
    Object.values(selections).forEach(p => addItem(p));
    alert("¡Toda la configuración ha sido añadida al carrito!");
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto pt-32 pb-20 px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Columna Izquierda: Pasos e Selección */}
          <div className="flex-1">
            <header className="mb-12">
              <h1 className="text-4xl font-orbitron font-black text-primary tracking-tighter mb-2 italic">ARMA TU SETUP ELITE</h1>
              <p className="text-gray-500 uppercase tracking-widest text-[10px] font-bold">Configuración paso a paso con compatibilidad garantizada</p>
            </header>

            {/* Stepper */}
            <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar mb-12">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                const isSelected = selections[step.id];
                const isActive = currentStep === index;
                
                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(index)}
                    className={`shrink-0 flex flex-col items-center gap-2 p-4 border transition-all min-w-[100px] ${
                      isActive ? 'border-primary bg-primary/5' : 
                      isSelected ? 'border-green-500/50 bg-green-500/5' : 'border-gray-800 bg-secondary/10'
                    }`}
                  >
                    <div className={`${isActive ? 'text-primary' : isSelected ? 'text-green-500' : 'text-gray-600'}`}>
                      {isSelected ? <CheckCircle2 size={24} /> : <Icon size={24} />}
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-white' : 'text-gray-500'}`}>
                      {step.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Listado de Productos del Paso Actual */}
            <div className="space-y-4">
              <h2 className="text-xl font-orbitron font-bold text-gray-300 flex items-center gap-3">
                <span className="text-primary">0{currentStep + 1}</span> {STEPS[currentStep].name.toUpperCase()}
              </h2>

              {loading ? (
                <div className="py-20 text-center animate-pulse text-gray-500 font-orbitron uppercase text-xs">Cargando componentes...</div>
              ) : filteredProducts.length === 0 ? (
                <div className="py-20 text-center border border-dashed border-gray-800 text-gray-600">No hay productos disponibles en esta categoría actualmente.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredProducts.map((product) => (
                    <div 
                      key={product.id}
                      className={`group p-4 border transition-all flex gap-4 items-center ${
                        selections[currentCategory]?.id === product.id ? 'border-primary bg-primary/5' : 'border-gray-800 hover:border-gray-600 bg-secondary/5'
                      }`}
                    >
                      <img src={product.image} alt={product.name} className="w-20 h-20 object-contain bg-black p-2" />
                      <div className="flex-1">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{product.brand}</p>
                        <h4 className="font-bold text-sm mb-1">{product.name}</h4>
                        <p className="text-primary font-orbitron text-lg font-black">${product.price.toFixed(2)}</p>
                      </div>
                      <button 
                        onClick={() => handleSelect(product)}
                        className={`px-6 py-2 text-[10px] font-black transition-all ${
                          selections[currentCategory]?.id === product.id 
                          ? 'bg-green-500 text-black' 
                          : 'bg-primary text-black hover:bg-white'
                        }`}
                      >
                        {selections[currentCategory]?.id === product.id ? 'SELECCIONADO' : 'SELECCIONAR'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between mt-12 pt-8 border-t border-gray-900">
              <button 
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="flex items-center gap-2 text-gray-500 hover:text-white disabled:opacity-0 transition-all font-bold text-xs"
              >
                <ChevronLeft size={16} /> PASO ANTERIOR
              </button>
              <button 
                onClick={() => setCurrentStep(Math.min(STEPS.length - 1, currentStep + 1))}
                disabled={currentStep === STEPS.length - 1}
                className="flex items-center gap-2 text-primary hover:text-white disabled:opacity-0 transition-all font-bold text-xs"
              >
                SIGUIENTE PASO <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Columna Derecha: Resumen del Build */}
          <div className="lg:w-96">
            <div className="bg-secondary/10 border border-gray-800 p-8 sticky top-32">
              <h3 className="font-orbitron font-black text-lg mb-8 tracking-tighter border-b border-gray-800 pb-4 italic">TU CONFIGURACIÓN</h3>
              
              <div className="space-y-6 mb-12">
                {STEPS.map((step) => (
                  <div key={step.id} className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mb-1">{step.name}</p>
                      {selections[step.id] ? (
                        <div className="flex justify-between items-start">
                          <p className="text-xs font-bold text-gray-300 leading-tight">{selections[step.id].name}</p>
                          <button onClick={() => removeSelection(step.id)} className="text-gray-700 hover:text-red-500 transition-colors ml-2">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ) : (
                        <p className="text-[10px] text-gray-800 italic uppercase">No seleccionado</p>
                      )}
                    </div>
                    {selections[step.id] && (
                      <span className="text-xs font-orbitron text-primary">${selections[step.id].price.toFixed(2)}</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="border-t border-primary/30 pt-6 mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Inversión Total</span>
                  <span className="text-primary font-orbitron font-black text-2xl">${total.toFixed(2)}</span>
                </div>
                <p className="text-[9px] text-gray-600 uppercase text-center font-bold">Precios con IVA incluido</p>
              </div>

              <button 
                onClick={addAllToCart}
                disabled={Object.keys(selections).length === 0}
                className="w-full bg-primary text-black font-black py-4 flex items-center justify-center gap-3 hover:bg-white transition-all disabled:opacity-50 disabled:grayscale"
              >
                <ShoppingCart size={18} /> AGREGAR TODO AL CARRITO
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
