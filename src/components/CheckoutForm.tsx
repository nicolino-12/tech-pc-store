"use client";

import { useState } from 'react';
import { User, Mail, MapPin, Phone, Building2, Globe, Send } from 'lucide-react';

interface CheckoutFormProps {
  onSubmit: (data: CheckoutData) => void;
  onBack: () => void;
  isLoading: boolean;
}

export interface CheckoutData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

export default function CheckoutForm({ onSubmit, onBack, isLoading }: CheckoutFormProps) {
  const [formData, setFormData] = useState<CheckoutData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'AR', // Default or asked
    postalCode: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 animate-in fade-in slide-in-from-right duration-500">
      <div className="space-y-4">
        <h3 className="font-orbitron text-primary text-sm font-bold tracking-widest mb-4">DATOS DE ENTREGA</h3>
        
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            required
            type="text"
            name="name"
            placeholder="Nombre Completo"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-black/50 border border-gray-800 p-3 pl-10 focus:border-primary outline-none transition-colors font-orbitron text-sm"
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            required
            type="email"
            name="email"
            placeholder="Correo Electrónico"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-black/50 border border-gray-800 p-3 pl-10 focus:border-primary outline-none transition-colors font-orbitron text-sm"
          />
        </div>

        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            required
            type="tel"
            name="phone"
            placeholder="Teléfono"
            value={formData.phone}
            onChange={handleChange}
            className="w-full bg-black/50 border border-gray-800 p-3 pl-10 focus:border-primary outline-none transition-colors font-orbitron text-sm"
          />
        </div>

        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            required
            type="text"
            name="address"
            placeholder="Dirección de Envío"
            value={formData.address}
            onChange={handleChange}
            className="w-full bg-black/50 border border-gray-800 p-3 pl-10 focus:border-primary outline-none transition-colors font-orbitron text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              required
              type="text"
              name="city"
              placeholder="Ciudad"
              value={formData.city}
              onChange={handleChange}
              className="w-full bg-black/50 border border-gray-800 p-3 pl-10 focus:border-primary outline-none transition-colors font-orbitron text-sm"
            />
          </div>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full bg-black/50 border border-gray-800 p-3 pl-10 focus:border-primary outline-none transition-colors font-orbitron text-sm appearance-none"
            >
              <option value="AR">Argentina</option>
              <option value="CL">Chile</option>
              <option value="ES">España</option>
              <option value="MX">México</option>
              <option value="US">USA</option>
            </select>
          </div>
        </div>

        <div className="relative">
          <input
            required
            type="text"
            name="postalCode"
            placeholder="Código Postal"
            value={formData.postalCode}
            onChange={handleChange}
            className="w-full bg-black/50 border border-gray-800 p-3 focus:border-primary outline-none transition-colors font-orbitron text-sm"
          />
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 border border-gray-800 py-4 hover:bg-gray-800 transition-colors font-bold text-sm"
        >
          VOLVER AL CARRITO
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-primary text-black py-4 hover:bg-white transition-colors font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              CONTINUAR AL PAGO <Send size={16} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
