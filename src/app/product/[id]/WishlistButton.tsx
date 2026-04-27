"use client";

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function WishlistButton({ productId }: { productId: string }) {
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const checkStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('wishlist')
          .select('*')
          .eq('user_id', user.id)
          .eq('product_id', productId)
          .single();
        if (data) setIsLiked(true);
      }
      setLoading(false);
    };
    checkStatus();
  }, [productId, supabase]);

  const toggleWishlist = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('Debes iniciar sesión para guardar favoritos');
      return;
    }

    if (isLiked) {
      await supabase.from('wishlist').delete().eq('user_id', user.id).eq('product_id', productId);
      setIsLiked(false);
    } else {
      await supabase.from('wishlist').insert({ user_id: user.id, product_id: productId });
      setIsLiked(true);
    }
  };

  if (loading) return <div className="w-12 h-12 border border-gray-800 animate-pulse bg-secondary/10" />;

  return (
    <button 
      onClick={toggleWishlist}
      className={`p-4 border transition-all ${isLiked ? 'bg-primary/10 border-primary text-primary' : 'bg-secondary/10 border-gray-800 text-gray-500 hover:border-primary hover:text-primary'}`}
    >
      <Heart size={24} fill={isLiked ? "currentColor" : "none"} />
    </button>
  );
}
