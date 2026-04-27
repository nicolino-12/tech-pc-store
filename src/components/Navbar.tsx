"use client";

import Link from 'next/link';
import Cart from './Cart';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{ full_name: string; role: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const q = searchParams.get('search');
    if (q) setSearchQuery(q);
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}#catalogo`);
    } else {
      router.push('/');
    }
  };

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, role')
          .eq('id', user.id)
          .single();
        setProfile(data);
      } else {
        setProfile(null);
      }
    };

    fetchUserAndProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (!currentUser) setProfile(null);
      else {
        // Re-fetch profile if user changes
        fetchUserAndProfile();
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/"; 
  };

  return (
    <nav className="w-full h-20 border-b border-gray-800 flex items-center justify-between px-8 bg-black/50 backdrop-blur-md fixed top-0 z-50">
      <Link href="/" className="font-orbitron text-2xl font-bold tracking-wider text-primary shrink-0">
        TECH_PC
      </Link>

      {/* Buscador */}
      <div className="flex-1 max-w-md mx-8 hidden lg:block">
        <form onSubmit={handleSearch} className="relative group">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar componentes..."
            className="w-full bg-secondary/30 border border-gray-800 px-10 py-2 text-sm focus:border-primary focus:outline-none transition-all group-hover:border-gray-700"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-primary transition-colors" />
          {searchQuery && (
            <button 
              type="button" 
              onClick={() => { setSearchQuery(''); router.push('/'); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              ×
            </button>
          )}
        </form>
      </div>

      <div className="flex items-center gap-8">
        <Link href="/" className="hover:text-primary transition-colors hidden md:block">Catálogo</Link>
        <Link href="#" className="hover:text-primary transition-colors hidden md:block">Ofertas</Link>
        <div className="w-px h-6 bg-gray-800 mx-2 hidden md:block"></div>
        <Cart />
        
        {user ? (
          <div className="flex items-center gap-4">
            {profile?.role === 'admin' && (
              <Link href="/admin" className="text-[10px] text-primary border border-primary/30 px-3 py-1 hover:bg-primary/10 transition-colors hidden sm:block font-bold tracking-widest">
                PANEL ADMIN
              </Link>
            )}
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-xs font-bold text-white uppercase">{profile?.full_name || user.email}</span>
              <span className="text-[10px] text-gray-500 uppercase">{profile?.role === 'admin' ? 'Administrador' : 'Cliente Elite'}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="border border-red-900/50 text-red-500 px-4 py-2 hover:bg-red-950/30 transition-colors text-[10px] font-black tracking-widest"
            >
              SALIR
            </button>
          </div>
        ) : (
          <Link href="/login" className="border border-primary px-6 py-2 hover:bg-primary hover:text-black transition-all text-xs font-bold font-orbitron tracking-widest">
            ACCESO
          </Link>
        )}
      </div>
    </nav>
  );
}
