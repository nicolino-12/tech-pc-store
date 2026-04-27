"use client";

import { motion } from "framer-motion";

const BRANDS = [
  "INTEL", "AMD", "NVIDIA", "ASUS", "CORSAIR", "MSI", "LOGITECH", "RAZER", "SAMSUNG", "WD_BLACK", "GIGABYTE", "KINGSTON"
];

export default function BrandCarousel() {
  return (
    <div className="py-20 bg-black/50 border-y border-gray-800 overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-black to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-black to-transparent z-10" />
      
      <div className="flex items-center mb-10 justify-center">
        <h3 className="font-orbitron text-xs font-bold tracking-[0.3em] text-gray-500 uppercase">
          Partners Tecnológicos Elite
        </h3>
      </div>

      <motion.div 
        className="flex whitespace-nowrap"
        animate={{ x: [0, -1000] }}
        transition={{ 
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear"
          }
        }}
      >
        {[...BRANDS, ...BRANDS].map((brand, index) => (
          <div 
            key={index} 
            className="mx-12 text-4xl md:text-5xl font-black font-orbitron text-gray-800 hover:text-primary transition-colors cursor-default select-none flex items-center gap-4 group"
          >
            <span className="opacity-20 group-hover:opacity-100 transition-opacity">/</span>
            {brand}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
