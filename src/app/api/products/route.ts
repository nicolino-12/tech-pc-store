import { NextResponse } from 'next/server';

// Datos estáticos de ejemplo
const MOCK_PRODUCTS = [
  { id: '1', name: 'RTX 4090 OC Edition', price: 1599.99, description: 'La tarjeta gráfica más potente del mercado.', image: '' },
  { id: '2', name: 'AMD Ryzen 9 7950X3D', price: 699.99, description: 'Rendimiento extremo para gaming y creación de contenido.', image: '' },
  { id: '3', name: 'ASUS ROG Crosshair X670E', price: 499.99, description: 'Motherboard premium con soporte PCIe 5.0.', image: '' },
  { id: '4', name: 'Corsair Vengeance 64GB DDR5', price: 250.00, description: 'Memoria RAM de alta velocidad y baja latencia.', image: '' },
];

export async function GET() {
  try {
    // Aquí iría la consulta a PostgreSQL/Supabase
    // const { data, error } = await supabase.from('products').select('*');
    
    return NextResponse.json(MOCK_PRODUCTS);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching products' }, { status: 500 });
  }
}
