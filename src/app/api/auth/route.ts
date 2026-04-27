import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Aquí iría la lógica de autenticación real con Supabase o JWT:
    // const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    
    if (email === 'admin@techpc.com' && password === 'admin123') {
      return NextResponse.json({ 
        user: { id: '1', email, role: 'admin' },
        token: 'mock-jwt-token-123'
      });
    }

    return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });

  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
