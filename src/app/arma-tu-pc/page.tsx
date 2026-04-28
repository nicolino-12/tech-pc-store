"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Navbar from '@/components/Navbar';
import { Cpu, Layout as MotherboardIcon, HardDrive, Monitor, MousePointer2, CheckCircle2, ChevronRight, ChevronLeft, ShoppingCart, Trash2, Zap, Info, ChevronUp, ChevronDown, Download } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useToastStore } from '@/store/useToastStore';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from "jspdf";

const STEPS = [
  { id: 'Procesadores', name: 'Procesador', icon: Cpu },
  { id: 'Coolers', name: 'Cooler CPU', icon: MousePointer2 },
  { id: 'Motherboards', name: 'Placa Madre', icon: MotherboardIcon },
  { id: 'Memorias', name: 'Memoria RAM', icon: MousePointer2 },
  { id: 'Gráficas', name: 'Placa de Video', icon: Monitor },
  { id: 'Almacenamiento', name: 'Disco / SSD', icon: HardDrive },
  { id: 'Gabinetes', name: 'Gabinete', icon: Monitor },
  { id: 'Fuentes', name: 'Fuente', icon: Zap },
];

export const dynamic = 'force-dynamic';

export default function ArmaTuPC() {
  const [isMounted, setIsMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selections, setSelections] = useState<Record<string, { product: any, quantity: number }>>({});
  const [showSummaryMobile, setShowSummaryMobile] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const addToast = useToastStore((state) => state.addToast);
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
  const selectedCPU = selections['Procesadores']?.product;
  const selectedMother = selections['Motherboards']?.product;

  const filteredProducts = products.filter(p => {
    if (currentCategory === 'Motherboards') {
      if (!(p.category === 'Motherboards' || p.category === 'Memorias' && (p.name.toLowerCase().includes('mother') || p.name.toLowerCase().includes('placa base')))) return false;
    } else if (p.category !== currentCategory) return false;
    if (currentCategory === 'Motherboards' && selectedCPU?.socket) {
      if (p.socket && p.socket !== selectedCPU.socket) return false;
    }
    if (currentCategory === 'Memorias' && selectedMother?.ram_type) {
      if (p.ram_type && p.ram_type !== selectedMother.ram_type) return false;
    }
    return true;
  });

  const handleSelect = (product: any) => {
    setSelections(prev => ({ ...prev, [currentCategory]: { product, quantity: 1 } }));
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    addToast(`${product.name.substring(0, 20)}... SELECCIONADO`, 'success');
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
    addToast("COMPONENTE ELIMINADO", 'info');
  };

  const totalList = Object.values(selections).reduce((acc, item) => acc + (Number(item.product.price) * item.quantity), 0);
  const totalSpecial = totalList * 0.85;
  const totalWatts = Object.values(selections).reduce((acc, item) => acc + (Number(item.product.wattage || 0) * item.quantity), 0);

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(0, 0, 0);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(0, 240, 255);
    doc.setFontSize(22);
    doc.text("TECH PC STORE", 20, 25);
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text("PRESUPUESTO DE ARMADO ELITE", 20, 32);
    
    // Details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 50);
    doc.text(`Consumo Estimado: ${totalWatts}W`, 140, 50);
    
    doc.line(20, 55, 190, 55);
    
    let y = 65;
    STEPS.forEach((step) => {
      const item = selections[step.id];
      if (item) {
        doc.setFont("helvetica", "bold");
        doc.text(step.name.toUpperCase(), 20, y);
        doc.setFont("helvetica", "normal");
        doc.text(item.product.name.substring(0, 70), 20, y + 5);
        doc.text(`$${item.product.price.toLocaleString()}`, 170, y + 5, { align: 'right' });
        y += 15;
      }
    });
    
    doc.line(20, y, 190, y);
    y += 10;
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL (PRECIO ESPECIAL):", 20, y);
    doc.setTextColor(0, 150, 150);
    doc.text(`$${totalSpecial.toLocaleString()}`, 190, y, { align: 'right' });
    
    doc.save(`Presupuesto_TechPC_${Date.now()}.pdf`);
    addToast("PDF GENERADO CON ÉXITO", 'success');
  };

  const addAllToCart = () => {
    Object.values(selections).forEach(item => {
      for (let i = 0; i < item.quantity; i++) addItem(item.product);
    });
    addToast("¡TU BUILD HA SIDO AÑADIDA AL CARRITO!", 'success');
  };

  return (
    <main className="min-h-screen bg-black text-white pb-32 lg:pb-0">
      <Navbar />
      
      <div className="max-w-7xl mx-auto pt-20 md:pt-28 pb-10 px-4 md:px-8">
        
        {/* Header Adaptado */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-6xl font-orbitron font-black tracking-tighter italic uppercase">
            Armá tu <span className="text-primary">PC</span>
          </h1>
          <p className="text-gray-400 text-[10px] md:text-sm font-bold uppercase tracking-[0.2em] mt-3 max-w-2xl mx-auto leading-relaxed">
            Configurá tu nueva PC sin errores de compatibilidad, <br className="hidden md:block" />
            seleccionando todos los componentes que deseás.
          </p>

          <div className="flex justify-center gap-8 mt-8 border-y border-gray-900 py-6">
            <div className="text-center">
              <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-1">Consumo Estimado</p>
              <p className="font-orbitron font-black text-2xl text-yellow-500">{totalWatts}W</p>
            </div>
            <div className="w-px h-12 bg-gray-900"></div>
            <div className="text-center">
              <p className="text-[10px] text-primary font-black uppercase italic tracking-widest mb-1">Precio Especial</p>
              <p className="font-orbitron font-black text-2xl text-primary">${totalSpecial.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="flex-1">
            {/* Stepper Móvil (Horizontal Scroll) */}
            <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar mb-6 border-b border-gray-900 sticky top-20 bg-black/80 backdrop-blur-sm z-30 py-2">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                const isSelected = selections[step.id];
                const isActive = currentStep === index;
                
                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(index)}
                    className={`shrink-0 flex items-center gap-2 p-2 px-4 rounded-full transition-all text-[9px] font-black uppercase ${
                      isActive ? 'bg-primary text-black' : 
                      isSelected ? 'bg-green-500/20 text-green-500 border border-green-500/30' : 'bg-secondary/20 text-gray-500'
                    }`}
                  >
                    <Icon size={12} />
                    <span className="whitespace-nowrap">{step.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Alerta compatibilidad móvil */}
            {currentCategory === 'Motherboards' && selectedCPU && (
              <div className="mb-4 p-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[8px] font-bold flex items-center gap-2 uppercase tracking-widest">
                <Info size={12} /> Socket: {selectedCPU.socket}
              </div>
            )}

            {/* Listado de Productos Optimizado */}
            <div className="grid grid-cols-1 gap-3">
              {loading ? (
                <div className="py-20 text-center animate-pulse text-gray-500 font-orbitron text-[10px]">PROCESANDO...</div>
              ) : filteredProducts.length === 0 ? (
                <div className="py-20 text-center border border-dashed border-gray-800 rounded-lg">
                  <p className="text-gray-600 text-xs mb-4">Sin stock compatible.</p>
                  <button onClick={() => setCurrentStep(0)} className="bg-primary/10 text-primary px-6 py-2 text-[10px] font-black">VOLVER AL INICIO</button>
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <div 
                    key={product.id}
                    className={`p-4 border transition-all flex gap-4 ${
                      selections[currentCategory]?.product.id === product.id ? 'border-primary bg-primary/5' : 'border-gray-900 bg-secondary/5'
                    }`}
                  >
                    <img src={product.image} alt={product.name} className="w-20 h-20 md:w-24 md:h-24 object-contain bg-black rounded" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-[8px] text-gray-500 font-bold uppercase mb-1">{product.brand}</p>
                        <h4 className="font-bold text-xs md:text-sm leading-tight mb-2 line-clamp-2">{product.name}</h4>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-[10px] md:text-lg font-orbitron font-black text-primary">${(product.price * 0.85).toLocaleString()}</p>
                        </div>
                        <button 
                          onClick={() => handleSelect(product)}
                          className={`px-4 py-2 text-[9px] font-black uppercase transition-all ${
                            selections[currentCategory]?.product.id === product.id 
                            ? 'bg-green-500 text-black' 
                            : 'bg-white text-black'
                          }`}
                        >
                          {selections[currentCategory]?.product.id === product.id ? 'OK' : 'Elegir'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Navegación inferior */}
            <div className="flex justify-between mt-8 md:hidden">
              <button onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} className="text-[9px] font-bold text-gray-500 uppercase flex items-center gap-1">
                <ChevronLeft size={14} /> Atrás
              </button>
              <button onClick={() => setCurrentStep(Math.min(STEPS.length - 1, currentStep + 1))} className="text-[9px] font-bold text-primary uppercase flex items-center gap-1">
                Siguiente <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Resumen Desktop */}
          <div className="hidden lg:block w-96">
            <div className="bg-secondary/10 border border-gray-800 rounded-lg p-6 sticky top-32">
              <h3 className="font-orbitron font-black text-base mb-6 tracking-tighter border-b border-gray-800 pb-3 italic">RESUMEN</h3>
              <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {STEPS.map((step) => {
                  const selection = selections[step.id];
                  return (
                    <div key={step.id} className={`p-3 border ${selection ? 'border-gray-700 bg-black/40' : 'border-gray-800/20'}`}>
                      <p className="text-[8px] text-gray-500 font-bold uppercase mb-1">{step.name}</p>
                      {selection ? (
                        <div>
                          <p className="text-[10px] font-bold text-gray-300 leading-tight mb-2">{selection.product.name}</p>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 bg-gray-900 rounded px-2">
                              <button onClick={() => updateQuantity(step.id, -1)} className="text-primary font-bold">-</button>
                              <span className="text-[10px] font-bold">{selection.quantity}</span>
                              <button onClick={() => updateQuantity(step.id, 1)} className="text-primary font-bold">+</button>
                            </div>
                            <span className="text-xs font-orbitron text-primary">${(selection.product.price * 0.85 * selection.quantity).toLocaleString()}</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-[8px] text-gray-800 italic uppercase">Pendiente</p>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-gray-800 pt-4 mb-6">
                <div className="flex justify-between items-center mb-1 text-[10px] text-gray-500 uppercase font-bold">
                  <span>Lista</span>
                  <span>${totalList.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-primary font-bold uppercase italic">Especial</span>
                  <span className="text-primary font-orbitron font-black text-xl">${totalSpecial.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button onClick={addAllToCart} disabled={Object.keys(selections).length === 0} className="w-full bg-primary text-black font-black py-4 text-xs uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(0,240,255,0.2)]">COMPRAR AHORA</button>
                <button onClick={generatePDF} disabled={Object.keys(selections).length === 0} className="w-full bg-transparent border border-gray-700 text-gray-400 font-bold py-3 text-[10px] uppercase tracking-widest hover:border-white hover:text-white transition-all flex items-center justify-center gap-2">
                  <Download size={14} /> Descargar Presupuesto
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* FOOTER MÓVIL (Solo visible en pantallas pequeñas) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[60] bg-black border-t border-gray-800 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
        <div className="flex justify-between items-center mb-2">
          <button onClick={() => setShowSummaryMobile(!showSummaryMobile)} className="text-[10px] font-black text-primary uppercase flex items-center gap-1">
            {showSummaryMobile ? <ChevronDown size={14} /> : <ChevronUp size={14} />} 
            Ver Configuración ({Object.keys(selections).length})
          </button>
          <div className="text-right">
            <p className="text-[8px] text-gray-500 font-bold uppercase italic">Especial</p>
            <p className="text-primary font-orbitron font-black text-lg">${totalSpecial.toLocaleString()}</p>
          </div>
        </div>
        <button onClick={addAllToCart} disabled={Object.keys(selections).length === 0} className="w-full bg-primary text-black font-black py-3 text-[10px] uppercase tracking-widest disabled:opacity-50">
          COMPRAR AHORA
        </button>
      </div>

      {/* Drawer Móvil para Resumen */}
      <AnimatePresence>
        {showSummaryMobile && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSummaryMobile(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] lg:hidden" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: 'spring', damping: 25 }} className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-primary/30 z-[80] p-6 max-h-[80vh] overflow-y-auto rounded-t-3xl lg:hidden">
              <div className="w-12 h-1.5 bg-gray-800 rounded-full mx-auto mb-6" />
              <h3 className="font-orbitron font-black text-center mb-6 text-primary tracking-widest italic">TU CONFIGURACIÓN</h3>
              <div className="space-y-4">
                {STEPS.map((step) => {
                  const selection = selections[step.id];
                  return (
                    <div key={step.id} className="flex justify-between items-start border-b border-gray-900 pb-4">
                      <div className="flex-1">
                        <p className="text-[8px] text-gray-500 font-bold uppercase mb-1">{step.name}</p>
                        {selection ? (
                          <p className="text-[11px] font-bold text-white pr-4">{selection.product.name}</p>
                        ) : (
                          <p className="text-[10px] text-gray-800 italic">No seleccionado</p>
                        )}
                      </div>
                      {selection && (
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-[11px] font-orbitron text-primary">${(selection.product.price * 0.85 * selection.quantity).toLocaleString()}</span>
                          <button onClick={() => removeSelection(step.id)} className="text-red-500"><Trash2 size={14} /></button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              <div className="flex flex-col gap-3 mt-8">
                <button onClick={addAllToCart} disabled={Object.keys(selections).length === 0} className="w-full py-4 bg-primary text-black font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(0,240,255,0.2)]">COMPRAR AHORA</button>
                <button onClick={generatePDF} disabled={Object.keys(selections).length === 0} className="w-full py-4 bg-transparent border border-gray-700 text-gray-400 font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                  <Download size={14} /> DESCARGAR PDF
                </button>
                <button onClick={() => setShowSummaryMobile(false)} className="w-full py-4 bg-secondary/50 text-white font-bold text-xs uppercase tracking-widest border border-gray-800">CERRAR</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
