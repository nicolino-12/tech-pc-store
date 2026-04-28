"use client";

import { Trash2 } from "lucide-react";
import { deleteProduct } from "./actions";
import { useToastStore } from "@/store/useToastStore";

export default function DeleteProductButton({ id }: { id: string }) {
  const addToast = useToastStore(state => state.addToast);

  const handleDelete = async () => {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        await deleteProduct(id);
        addToast("PRODUCTO ELIMINADO", "success");
      } catch (e) {
        addToast("ERROR AL ELIMINAR", "error");
      }
    }
  };

  return (
    <button 
      onClick={handleDelete}
      className="text-gray-600 hover:text-red-500 transition-colors p-2 border border-gray-800 hover:border-red-500 rounded"
    >
      <Trash2 size={16} />
    </button>
  );
}
