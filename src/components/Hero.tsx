import { ArrowRight, Cpu, Shield, Zap } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-8 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-8">
          <span className="w-2 h-2 bg-primary rounded-full animate-ping"></span>
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Hardware de Próxima Generación</span>
        </div>

        <h1 className="font-orbitron text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-[0.9] italic">
          EXPERIMENTA EL <br /> 
          <span className="text-gradient">PODER TOTAL</span>
        </h1>

        <p className="max-w-2xl mx-auto text-gray-500 text-sm md:text-base font-bold uppercase tracking-widest mb-10 leading-relaxed">
          La tienda de tecnología más avanzada para gamers y entusiastas. <br className="hidden md:block" />
          Componentes de alto rendimiento con garantía oficial.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href="/arma-tu-pc" 
            className="group relative px-10 py-5 bg-primary text-black font-black text-xs uppercase tracking-widest overflow-hidden transition-all hover:bg-white shadow-[0_0_30px_rgba(0,240,255,0.3)]"
          >
            <span className="relative z-10 flex items-center gap-3">
              Arma tu PC <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </span>
          </Link>
          <Link 
            href="#catalogo" 
            className="px-10 py-5 border border-gray-800 text-white font-black text-xs uppercase tracking-widest hover:border-primary hover:text-primary transition-all"
          >
            Ver Catálogo
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 max-w-5xl mx-auto">
          {[
            { icon: Zap, title: "Envío Flash", desc: "Llegamos en 24hs" },
            { icon: Shield, title: "Garantía Real", desc: "Soporte oficial" },
            { icon: Cpu, title: "Hardware PRO", desc: "Lo último del mercado" }
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-5 p-6 bg-secondary/5 border border-gray-900 group hover:border-primary/30 transition-all">
              <div className="p-3 bg-black border border-gray-800 text-primary group-hover:scale-110 transition-transform">
                <feature.icon size={24} />
              </div>
              <div className="text-left">
                <h4 className="font-orbitron text-xs font-black text-white uppercase">{feature.title}</h4>
                <p className="text-[10px] text-gray-600 font-bold uppercase">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
