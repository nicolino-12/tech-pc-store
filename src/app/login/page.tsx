import { login, signup } from './actions'

export default function LoginPage({ searchParams }: { searchParams: { message: string } }) {
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto min-h-screen">
      <h1 className="text-3xl font-orbitron font-bold text-center mb-8 text-primary">TECH_PC ACCESS</h1>
      
      <form className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
        <label className="text-md font-bold text-gray-300" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-none px-4 py-3 bg-secondary/50 border border-gray-700 mb-6 focus:border-primary focus:outline-none"
          name="email"
          type="email"
          placeholder="tu@correo.com"
          required
        />
        
        <label className="text-md font-bold text-gray-300" htmlFor="password">
          Contraseña
        </label>
        <input
          className="rounded-none px-4 py-3 bg-secondary/50 border border-gray-700 mb-6 focus:border-primary focus:outline-none"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        
        <button formAction={login} className="bg-primary text-black font-bold py-3 px-4 rounded-none hover:bg-transparent hover:text-primary border border-primary transition-all mb-2">
          INICIAR SESIÓN
        </button>
        <button formAction={signup} className="bg-transparent border border-gray-600 text-gray-300 py-3 px-4 rounded-none hover:border-primary hover:text-white transition-all mb-2">
          CREAR CUENTA
        </button>

        {searchParams?.message && (
          <p className="mt-4 p-4 bg-black border border-primary/50 text-primary text-center">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  )
}
