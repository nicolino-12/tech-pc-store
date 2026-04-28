"use client";

import { useToastStore, ToastType } from "@/store/useToastStore";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

const icons = {
  success: <CheckCircle2 className="text-green-500" size={18} />,
  error: <XCircle className="text-red-500" size={18} />,
  info: <Info className="text-primary" size={18} />,
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-24 right-8 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className="pointer-events-auto bg-black border border-gray-800 p-4 min-w-[280px] flex items-center gap-4 shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden"
          >
            {/* Glow bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${
              toast.type === 'success' ? 'bg-green-500' : 
              toast.type === 'error' ? 'bg-red-500' : 'bg-primary'
            }`} />
            
            {icons[toast.type]}
            
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-200">
              {toast.message}
            </p>

            <button 
              onClick={() => removeToast(toast.id)}
              className="ml-auto text-gray-600 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
