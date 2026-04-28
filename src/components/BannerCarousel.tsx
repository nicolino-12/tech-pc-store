"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BANNERS = [
  {
    id: 1,
    title: "SEMIFINALES DE OFERTAS",
    subtitle: "HASTA 40% OFF EN PLACAS DE VIDEO",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=2070&auto=format&fit=crop",
    color: "from-primary/20",
    cta: "VER OFERTAS"
  },
  {
    id: 2,
    title: "GEFORCE RTX 40 SERIES",
    subtitle: "MÁS QUE RÁPIDAS PARA JUGADORES Y CREADORES",
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=2070&auto=format&fit=crop",
    color: "from-green-500/20",
    cta: "COMPRAR AHORA"
  },
  {
    id: 3,
    title: "LO NUEVO DE INTEL",
    subtitle: "14va GENERACIÓN YA DISPONIBLE",
    image: "https://images.unsplash.com/photo-1555617766-c94804975da3?q=80&w=2070&auto=format&fit=crop",
    color: "from-blue-500/20",
    cta: "DESCUBRIR"
  }
];

export default function BannerCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === BANNERS.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev === BANNERS.length - 1 ? 0 : prev + 1));
  const prev = () => setCurrent((prev) => (prev === 0 ? BANNERS.length - 1 : prev - 1));

  return (
    <div className="relative w-full h-[300px] md:h-[500px] overflow-hidden group">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] scale-110 group-hover:scale-100"
            style={{ backgroundImage: `url(${BANNERS[current].image})` }}
          />
          
          {/* Overlay Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-r ${BANNERS[current].color} via-black/60 to-black`} />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-20">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="max-w-xl"
            >
              <h3 className="text-primary font-orbitron text-xs md:text-sm font-black tracking-[0.3em] mb-4">
                {BANNERS[current].title}
              </h3>
              <h2 className="text-white font-orbitron text-3xl md:text-6xl font-black mb-8 leading-tight tracking-tighter italic">
                {BANNERS[current].subtitle}
              </h2>
              <button className="px-8 py-4 bg-primary text-black font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_30px_rgba(0,240,255,0.3)]">
                {BANNERS[current].cta}
              </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button 
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-black/50 border border-white/10 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-black"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-black/50 border border-white/10 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-black"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 transition-all rounded-full ${i === current ? 'w-8 bg-primary' : 'w-2 bg-white/20'}`}
          />
        ))}
      </div>
    </div>
  );
}
