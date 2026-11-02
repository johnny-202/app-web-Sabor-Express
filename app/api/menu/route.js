import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM productos');
    
    const formattedRows = rows.map(item => ({
      id: item.id,
      name: item.nombre,
      description: item.descripcion,
      price: Number(item.precio),
      category: getCategorySlug(item.categoria_id),
      image: item.imagen_url || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85',
      popular: Boolean(item.es_popular),
      spicy: false
    }));

    return NextResponse.json({ success: true, data: formattedRows });
  } catch (error) {
    console.error('Error al obtener el menú:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function getCategorySlug(catId) {
  const map = { 
    2: 'hamburguesas', 
    3: 'platos fuertes', 
    4: 'mexicano', 
    5: 'fresco', 
    6: 'pizza', 
    7: 'bebidas', 
    8: 'postres' 
  };
  return map[catId] || 'platos fuertes';
}