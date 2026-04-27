"use client";

import { useState } from 'react';
import { login, signup } from './actions';
import { User, Mail, Lock, Phone, MapPin, ArrowRight, ArrowLeft } from 'lucide-react';

export default function LoginPage({ searchParams }: { searchParams: { message: string } }) {
  const [view, setView] = useState<'login' | 'signup'>('login');

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-lg justify-center mx-auto min-h-screen pt-20 pb-20">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-orbitron font-black text-primary tracking-tighter mb-2">TECH_PC ACCESS</h1>
        <p className="text-gray-500 text-sm uppercase tracking-widest font-bold">
          {view === 'login' ? 'Bienvenido de nuevo' : 'Únete a la élite del hardware'}
        </p>
      </div>
      
      <div className="bg-secondary/20 border border-gray-800 p-8 shadow-2xl shadow-primary/5 relative overflow-hidden">
        {/* Decoración */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16" />
        
        <form className="flex flex-col gap-5">
          {view === 'signup' && (
            <>
              <div className="relative">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">Nombre Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
                  <input
                    className="w-full rounded-none pl-10 pr-4 py-3 bg-black/50 border border-gray-700 focus:border-primary focus:outline-none transition-colors"
                    name="fullName"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">Teléfono</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
                    <input
                      className="w-full rounded-none pl-10 pr-4 py-3 bg-black/50 border border-gray-700 focus:border-primary focus:outline-none transition-colors"
                      name="phone"
                      placeholder="+1 234..."
                      required
                    />
                  </div>
                </div>
                <div className="relative">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">Dirección</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
                    <input
                      className="w-full rounded-none pl-10 pr-4 py-3 bg-black/50 border border-gray-700 focus:border-primary focus:outline-none transition-colors"
                      name="address"
                      placeholder="Calle 123..."
                      required
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="relative">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
              <input
                className="w-full rounded-none pl-10 pr-4 py-3 bg-black/50 border border-gray-700 focus:border-primary focus:outline-none transition-colors"
                name="email"
                type="email"
                placeholder="tu@correo.com"
                required
              />
            </div>
          </div>
          
          <div className="relative">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
              <input
                className="w-full rounded-none pl-10 pr-4 py-3 bg-black/50 border border-gray-700 focus:border-primary focus:outline-none transition-colors"
                type="password"
                name="password"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          
          {view === 'login' ? (
            <button 
              formAction={login} 
              className="mt-4 bg-primary text-black font-black py-4 px-4 rounded-none hover:bg-white transition-all tracking-widest flex items-center justify-center gap-2"
            >
              INICIAR SESIÓN <ArrowRight size={18} />
            </button>
          ) : (
            <button 
              formAction={signup} 
              className="mt-4 bg-white text-black font-black py-4 px-4 rounded-none hover:bg-primary transition-all tracking-widest flex items-center justify-center gap-2"
            >
              CREAR CUENTA <ArrowRight size={18} />
            </button>
          )}

          <div className="flex items-center justify-between mt-4">
            <button 
              type="button"
              onClick={() => setView(view === 'login' ? 'signup' : 'login')}
              className="text-xs text-gray-500 hover:text-primary transition-colors flex items-center gap-1 font-bold"
            >
              {view === 'login' ? (
                <>¿No tienes cuenta? REGÍSTRATE <ArrowRight size={12} /></>
              ) : (
                <><ArrowLeft size={12} /> YA TENGO CUENTA</>
              )}
            </button>
          </div>

          {searchParams?.message && (
            <div className="mt-6 p-4 bg-primary/10 border border-primary/30 text-primary text-xs font-bold text-center animate-in fade-in slide-in-from-top-1">
              {searchParams.message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
