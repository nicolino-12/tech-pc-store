"use client";

import { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { submitReview } from './actions';

export default function ReviewForm({ productId }: { productId: string }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitReview(productId, rating, comment);
      setComment('');
      setIsOpen(false);
      alert('¡Gracias por tu reseña!');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="text-[10px] font-black border border-gray-800 px-6 py-3 hover:border-primary transition-all uppercase tracking-widest bg-secondary/10"
      >
        Escribir Reseña
      </button>
    );
  }

  return (
    <div className="bg-secondary/10 border border-gray-800 p-8 animate-in slide-in-from-top-4 duration-500">
      <h3 className="font-orbitron font-bold text-sm mb-6 uppercase tracking-widest text-primary">Tu Calificación</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`transition-all ${rating >= star ? 'text-yellow-500' : 'text-gray-700'}`}
            >
              <Star size={24} fill={rating >= star ? "currentColor" : "none"} />
            </button>
          ))}
        </div>
        
        <div>
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Comentario</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            rows={4}
            className="w-full bg-black/50 border border-gray-800 p-4 text-sm focus:border-primary focus:outline-none transition-colors"
            placeholder="¿Qué te pareció este componente?"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-black font-black px-8 py-3 text-xs tracking-widest uppercase hover:bg-white transition-all flex items-center gap-2"
          >
            {isSubmitting ? 'Enviando...' : <><Send size={14} /> Enviar Reseña</>}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-gray-500 text-[10px] font-bold uppercase tracking-widest hover:text-white"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
