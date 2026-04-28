"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Navbar from '@/components/Navbar';
import { Cpu, Layout as MotherboardIcon, HardDrive, Monitor, MousePointer2, CheckCircle2, ChevronRight, ChevronLeft, ShoppingCart, Trash2, Zap, Info } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = [
  { id: 'Procesadores', name: 'Procesador', icon: Cpu },
  { id: 'Coolers', name: 'Cooler CPU', icon: MousePointer2 },
  { id: 'Motherboards', name: 'Placa Madre', icon: MotherboardIcon },
  { id: 'Memorias', name: 'Memoria RAM', icon: MousePointer2 },
  { id: 'Gráficas', name: 'Placa de Video', icon: Monitor },
  { id: 'Almacenamiento', name: 'Disco / SSD', icon: HardDrive },
  { id: 'Gabinetes', name: 'Gabinete', icon: Monitor },
  { id: 'Fuentes', name: 'Fuente de Alimentación', icon: Zap },
];

export const dynamic = 'force-dynamic';

export default function ArmaTuPC() {
  const [isMounted, setIsMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selections, setSelections] = useState<Record<string, { product: any, quantity: number }>>({});
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
  
  // Lógica de Compatibilidad
  const selectedCPU = selections['Procesadores']?.product;
  const selectedMother = selections['Motherboards']?.product;

  const filteredProducts = products.filter(p => {
    // 1. Filtrar por categoría base
    if (currentCategory === 'Motherboards') {
      if (!(p.category === 'Motherboards' || p.category === 'Memorias' && (p.name.toLowerCase().includes('mother') || p.name.toLowerCase().includes('placa base')))) return false;
    } else if (p.category !== currentCategory) return false;

    // 2. Compatibilidad de Socket (CPU -> Mother)
    if (currentCategory === 'Motherboards' && selectedCPU?.socket) {
      if (p.socket && p.socket !== selectedCPU.socket) return false;
    }

    // 3. Compatibilidad de RAM (Mother -> RAM)
    if (currentCategory === 'Memorias' && selectedMother?.ram_type) {
      if (p.ram_type && p.ram_type !== selectedMother.ram_type) return false;
    }

    return true;
  });

  const handleSelect = (product: any) => {
    setSelections(prev => ({ 
      ...prev, 
      [currentCategory]: { product, quantity: 1 } 
    }));
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const updateQuantity = (categoryId: string, delta: number) => {
    setSelections(prev => {
      const item = prev[categoryId];
      if (!item) return prev;
      const newQty = Math.max(1, item.quantity + delta);
      return { ...prev, [categoryId]: { ...item, quantity: newQty } };
    });
  };

  const removeSelection = (categoryId: string) => {
    const newSelections = { ...selections };
    delete newSelections[categoryId];
    setSelections(newSelections);
  };

  const totalList = Object.values(selections).reduce((acc, item) => acc + (Number(item.product.price) * item.quantity), 0);
  const totalSpecial = totalList * 0.85; // 15% de descuento por transferencia
  const totalWatts = Object.values(selections).reduce((acc, item) => acc + (Number(item.product.wattage || 0) * item.quantity), 0);

  const addAllToCart = () => {
    Object.values(selections).forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        addItem(item.product);
      }
    });
    alert("¡Tu build personalizada ha sido añadida al carrito!");
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto pt-24 pb-20 px-4 md:px-8">
        {/* Header Estilo Compra Gamer */}
        <div className="bg-secondary/10 border-l-4 border-primary p-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl font-orbitron font-black text-white tracking-tighter italic">ARMADO DE PC GAMER</h1>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Sigue los pasos para configurar tu equipo de ensueño</p>
          </div>
          <div className="flex gap-8 text-center">
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase">Consumo Estimado</p>
              <p className={`font-orbitron font-black text-xl ${totalWatts > 0 ? 'text-yellow-500' : 'text-gray-700'}`}>
                {totalWatts} <span className="text-xs">WATT</span>
              </p>
            </div>
            <div className="w-px h-10 bg-gray-800"></div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase italic text-primary">Precio Especial</p>
              <p className="font-orbitron font-black text-2xl text-primary">${totalSpecial.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Lado Izquierdo: Pasos y Lista */}
          <div className="flex-1">
            {/* Stepper Horizontal */}
            <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar mb-8 border-b border-gray-900">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                const isSelected = selections[step.id];
                const isActive = currentStep === index;
                
                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(index)}
                    className={`shrink-0 flex items-center gap-3 p-3 transition-all border-b-2 ${
                      isActive ? 'border-primary bg-primary/5' : 
                      isSelected ? 'border-green-500/50 text-green-500' : 'border-transparent text-gray-600'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-[10px] font-black uppercase tracking-tighter whitespace-nowrap">
                      {index + 1}. {step.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Advertencias de Compatibilidad */}
            <AnimatePresence>
              {currentCategory === 'Motherboards' && selectedCPU && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-bold flex items-center gap-3">
                  <Info size={16} /> FILTRANDO PLACAS PARA SOCKET: {selectedCPU.socket || 'DESCONOCIDO'}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Listado */}
            <div className="grid grid-cols-1 gap-3">
              {loading ? (
                <div className="py-20 text-center animate-pulse text-gray-500 font-orbitron text-xs">ANALIZANDO COMPONENTE...</div>
              ) : filteredProducts.length === 0 ? (
                <div className="py-20 text-center border border-dashed border-gray-800 rounded-lg">
                  <p className="text-gray-600 font-bold text-sm mb-2">No se encontraron productos compatibles.</p>
                  <button onClick={() => setCurrentStep(0)} className="text-primary text-[10px] font-black underline">REINICIAR ARMADO</button>
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <div 
                    key={product.id}
                    className={`group p-4 border transition-all flex flex-col md:flex-row gap-6 items-center ${
                      selections[currentCategory]?.product.id === product.id ? 'border-primary bg-primary/5' : 'border-gray-800 hover:border-gray-700 bg-secondary/5'
                    }`}
                  >
                    <img src={product.image} alt={product.name} className="w-24 h-24 object-contain bg-black rounded p-2" />
                    <div className="flex-1 text-center md:text-left">
                      <div className="flex items-center gap-2 mb-1 justify-center md:justify-start">
                        <span className="text-[9px] bg-gray-800 text-gray-400 px-2 py-0.5 font-bold">{product.brand}</span>
                        {product.socket && <span className="text-[9px] bg-blue-900/50 text-blue-300 px-2 py-0.5 font-bold uppercase">{product.socket}</span>}
                        {product.ram_type && <span className="text-[9px] bg-purple-900/50 text-purple-300 px-2 py-0.5 font-bold uppercase">{product.ram_type}</span>}
                      </div>
                      <h4 className="font-bold text-base leading-tight mb-2">{product.name}</h4>
                      <div className="flex items-center gap-4 justify-center md:justify-start">
                        <div className="text-xs text-gray-500 line-through">${product.price.toLocaleString()}</div>
                        <div className="text-primary font-orbitron text-xl font-black">${(product.price * 0.85).toLocaleString()}</div>
                        <div className="text-[9px] text-primary font-bold uppercase italic">Precio Especial</div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleSelect(product)}
                      className={`w-full md:w-auto px-10 py-3 text-[11px] font-black tracking-widest transition-all ${
                        selections[currentCategory]?.product.id === product.id 
                        ? 'bg-green-500 text-black' 
                        : 'bg-white text-black hover:bg-primary'
                      }`}
                    >
                      {selections[currentCategory]?.product.id === product.id ? 'SELECCIONADO' : 'ELEGIR'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Lado Derecho: Resumen Build */}
          <div className="lg:w-96">
            <div className="bg-secondary/10 border border-gray-800 rounded-lg p-6 sticky top-24">
              <h3 className="font-orbitron font-black text-base mb-6 tracking-tighter border-b border-gray-800 pb-3 flex items-center justify-between">
                RESUMEN DE COMPRA
                <span className="text-[10px] text-gray-600">PASO {currentStep + 1}/8</span>
              </h3>
              
              <div className="space-y-4 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {STEPS.map((step) => {
                  const selection = selections[step.id];
                  return (
                    <div key={step.id} className={`p-3 border transition-colors ${selection ? 'border-gray-700 bg-black/40' : 'border-gray-800/30'}`}>
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{step.name}</p>
                        {selection && (
                          <button onClick={() => removeSelection(step.id)} className="text-gray-700 hover:text-red-500">
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                      
                      {selection ? (
                        <div>
                          <p className="text-[11px] font-bold text-gray-200 mb-2 line-clamp-2">{selection.product.name}</p>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 bg-gray-900 rounded px-2">
                              <button onClick={() => updateQuantity(step.id, -1)} className="text-primary font-bold text-lg">-</button>
                              <span className="text-[10px] font-bold w-4 text-center">{selection.quantity}</span>
                              <button onClick={() => updateQuantity(step.id, 1)} className="text-primary font-bold text-lg">+</button>
                            </div>
                            <span className="text-xs font-orbitron text-primary">
                              ${(selection.product.price * 0.85 * selection.quantity).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => setCurrentStep(STEPS.indexOf(step))} className="text-[10px] text-gray-700 hover:text-primary italic uppercase">Elegir componente...</button>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="bg-black p-4 border border-gray-800 rounded-lg mb-6">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] text-gray-500 font-bold uppercase">Precio de Lista</span>
                  <span className="text-gray-400 font-orbitron text-sm">${totalList.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] text-primary font-bold uppercase italic">Precio Especial</span>
                  <span className="text-primary font-orbitron font-black text-xl">${totalSpecial.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-[9px] text-gray-500 font-bold uppercase justify-center">
                  <Zap size={12} className="text-yellow-500" /> 
                  Consumo Estimado: <span className="text-white">{totalWatts}W</span>
                </div>
              </div>

              <button 
                onClick={addAllToCart}
                disabled={Object.keys(selections).length === 0}
                className="w-full bg-primary text-black font-black py-4 flex items-center justify-center gap-3 hover:bg-white transition-all disabled:opacity-50 disabled:grayscale uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(0,240,255,0.2)]"
              >
                COMPRAR AHORA
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
