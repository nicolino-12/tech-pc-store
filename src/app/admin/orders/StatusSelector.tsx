"use client";

import { useState } from 'react';
import { updateOrderStatus } from '../actions';
import { Check, Loader2 } from 'lucide-react';

interface StatusSelectorProps {
  orderId: string;
  currentStatus: string;
}

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pendiente', color: 'yellow' },
  { value: 'paid', label: 'Pagado', color: 'green' },
  { value: 'shipped', label: 'Enviado', color: 'blue' },
  { value: 'delivered', label: 'Entregado', color: 'purple' },
  { value: 'cancelled', label: 'Cancelado', color: 'red' },
];

export default function StatusSelector({ orderId, currentStatus }: StatusSelectorProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [status, setStatus] = useState(currentStatus);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await updateOrderStatus(orderId, newStatus);
      setStatus(newStatus);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("No se pudo actualizar el estado.");
    } finally {
      setIsUpdating(false);
    }
  };

  const getColorClass = (s: string) => {
    switch (s) {
      case 'pending': return 'border-yellow-500 text-yellow-500 bg-yellow-500/10';
      case 'paid': return 'border-green-500 text-green-500 bg-green-500/10';
      case 'shipped': return 'border-blue-500 text-blue-500 bg-blue-500/10';
      case 'delivered': return 'border-purple-500 text-purple-500 bg-purple-500/10';
      case 'cancelled': return 'border-red-500 text-red-500 bg-red-500/10';
      default: return 'border-gray-500 text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="relative group">
      <div className={`flex items-center gap-2 px-3 py-1 text-[10px] font-bold uppercase tracking-widest border transition-all ${getColorClass(status)}`}>
        {isUpdating ? <Loader2 size={10} className="animate-spin" /> : <Check size={10} />}
        {STATUS_OPTIONS.find(o => o.value === status)?.label}
      </div>
      
      <div className="absolute right-0 top-full mt-2 w-32 bg-black border border-gray-800 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
        {STATUS_OPTIONS.map((option) => (
          <button
            key={option.value}
            disabled={isUpdating || status === option.value}
            onClick={() => handleStatusChange(option.value)}
            className={`w-full text-left px-3 py-2 text-[10px] font-bold uppercase hover:bg-gray-800 transition-colors ${
              status === option.value ? 'opacity-30' : ''
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
