import { Instagram, Twitter, Facebook, Mail, MapPin, Phone, ShieldCheck, Truck, CreditCard } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-900 pt-20 pb-10 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
        
        {/* Brand */}
        <div className="space-y-6">
          <h2 className="font-orbitron text-2xl font-black text-white tracking-tighter italic">
            TECH PC <span className="text-primary">STORE</span>
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Expertos en hardware de alto rendimiento. Llevamos tu experiencia gaming al siguiente nivel con tecnología de última generación.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center hover:border-primary hover:text-primary transition-all">
              <Instagram size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center hover:border-primary hover:text-primary transition-all">
              <Twitter size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center hover:border-primary hover:text-primary transition-all">
              <Facebook size={18} />
            </a>
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-orbitron text-xs font-black text-white uppercase tracking-widest mb-8">Navegación</h4>
          <ul className="space-y-4 text-gray-500 text-sm font-bold">
            <li><a href="/" className="hover:text-primary transition-colors">Inicio</a></li>
            <li><a href="/#catalogo" className="hover:text-primary transition-colors">Productos</a></li>
            <li><a href="/arma-tu-pc" className="hover:text-primary transition-colors">Armar PC</a></li>
            <li><a href="/orders" className="hover:text-primary transition-colors">Seguimiento</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-orbitron text-xs font-black text-white uppercase tracking-widest mb-8">Contacto</h4>
          <ul className="space-y-4 text-gray-500 text-sm">
            <li className="flex items-center gap-3">
              <MapPin size={16} className="text-primary" />
              <span>Av. Siempre Viva 742, Springfield</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={16} className="text-primary" />
              <span>+54 9 381 508-6009</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} className="text-primary" />
              <span>soporte@techpcstore.com</span>
            </li>
          </ul>
        </div>

        {/* Trust */}
        <div className="bg-secondary/10 p-6 border border-gray-800 rounded-2xl space-y-6">
          <div className="flex items-center gap-4">
            <ShieldCheck className="text-primary" size={24} />
            <div>
              <p className="text-white text-xs font-black uppercase">Garantía Oficial</p>
              <p className="text-gray-500 text-[10px]">Todos los productos originales</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Truck className="text-primary" size={24} />
            <div>
              <p className="text-white text-xs font-black uppercase">Envíos Seguros</p>
              <p className="text-gray-500 text-[10px]">Llegamos a todo el país</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <CreditCard className="text-primary" size={24} />
            <div>
              <p className="text-white text-xs font-black uppercase">Pago Seguro</p>
              <p className="text-gray-500 text-[10px]">Múltiples medios de pago</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-10 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">
          © {new Date().getFullYear()} TECH PC STORE. TODOS LOS DERECHOS RESERVADOS.
        </p>
        <div className="flex gap-6">
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="Paypal" className="h-4 opacity-30 grayscale" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-30 grayscale" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 opacity-30 grayscale" />
        </div>
      </div>
    </footer>
  );
}
