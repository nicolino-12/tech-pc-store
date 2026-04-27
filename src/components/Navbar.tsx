"use client";

import Link from 'next/link';
import Cart from './Cart';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // Obtener usuario actual al cargar
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    // Escuchar si el usuario inicia o cierra sesión
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/"; // Recargar página para limpiar estados
  };

  return (
    <nav className="w-full h-20 border-b border-gray-800 flex items-center justify-between px-8 bg-black/50 backdrop-blur-md fixed top-0 z-50">
      <Link href="/" className="font-orbitron text-2xl font-bold tracking-wider text-primary">
        TECH_PC
      </Link>
      <div className="flex items-center gap-8">
        <Link href="/" className="hover:text-primary transition-colors hidden md:block">Catálogo</Link>
        <Link href="#" className="hover:text-primary transition-colors hidden md:block">Ofertas</Link>
        <div className="w-px h-6 bg-gray-800 mx-2 hidden md:block"></div>
        <Cart />
        
        {user ? (
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-sm text-primary border border-primary/30 px-3 py-1 hover:bg-primary/10 transition-colors hidden sm:block font-bold">PANEL ADMIN</Link>
            <span className="text-sm text-gray-400 hidden sm:block">{user.email}</span>
            <button 
              onClick={handleLogout}
              className="border border-red-900/50 text-red-500 px-4 py-2 hover:bg-red-950/30 transition-colors text-sm font-bold"
            >
              SALIR
            </button>
          </div>
        ) : (
          <Link href="/login" className="border border-gray-600 px-4 py-2 hover:border-primary hover:text-primary transition-colors text-sm">
            LOGIN
          </Link>
        )}
      </div>
    </nav>
  );
}
