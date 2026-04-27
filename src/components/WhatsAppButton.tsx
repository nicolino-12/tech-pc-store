"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function WhatsAppButton() {
  const phoneNumber = "5493815086009"; 
  const message = encodeURIComponent("¡Hola! Estoy en la tienda Tech PC y tengo una consulta sobre un producto.");
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.1 }}
      className="fixed bottom-8 right-8 z-[100] flex items-center justify-center"
    >
      {/* Efecto de Pulso/Brillo */}
      <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-20 animate-pulse" />
      
      <div className="relative bg-[#25D366] text-white p-4 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:shadow-[0_0_30px_rgba(37,211,102,0.6)] transition-all flex items-center justify-center group">
        <MessageCircle size={28} fill="currentColor" />
        
        {/* Tooltip */}
        <span className="absolute right-16 bg-black border border-gray-800 text-white text-[10px] font-bold px-4 py-2 rounded-none whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none uppercase tracking-widest font-orbitron">
          Soporte Tech en Vivo
        </span>
      </div>
    </motion.a>
  );
}
