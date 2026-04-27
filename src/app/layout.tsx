import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const orbitron = Orbitron({ subsets: ["latin"], variable: '--font-orbitron' });

export const metadata: Metadata = {
  title: "Tech PC Store - Componentes y Armado de PC",
  description: "La mejor tienda de componentes de PC, notebooks y periféricos con diseño futurista.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${orbitron.variable} font-sans bg-black text-white antialiased`}>
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
