import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import SessionHeader from "./components/SessionHeader";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FRIJA",
  description: "Distribution",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-[#202521] text-white">

        {/* FONDO GLOBAL: negro profundo con reflejos sutiles y volúmenes oscuros */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-[#070708] via-[#0c0c0e] to-[#050506]"
        >
          <div className="absolute -top-24 left-1/4 h-[34rem] w-[34rem] rounded-full bg-white/[0.045] blur-[130px]" />
          <div className="absolute top-1/4 -right-24 h-[28rem] w-[28rem] rounded-full bg-[#2a2b2e]/30 blur-[120px]" />
          <div className="absolute -bottom-32 left-1/3 h-[32rem] w-[32rem] rounded-full bg-[#18181b]/50 blur-[140px]" />
        </div>

        {/* HEADER: barra de ancho completo, semitransparente en reposo y opaca con hover o foco */}
        <header className="fixed inset-x-0 top-0 z-50">

          <div
            tabIndex={0}
            className="group flex w-full items-center justify-between bg-[#fcfbf9]/40 px-8 py-3  backdrop-blur-xl outline-none transition-all duration-300 ease-out hover:bg-[#fcfbf9] hover:py-3.5 focus-within:bg-[#fcfbf9] focus-within:py-3.5 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#d9a441] motion-reduce:transition-none"
          >

            <img
              src="/Images/logo_gral.png"
              alt="LOGO_GRAL FRIJA"
              className="h-auto w-40 shrink-0 transition-all duration-300 ease-out group-hover:w-40 group-focus-within:w-44 motion-reduce:transition-none"
            />

            {/* Sesión: se desvanece en reposo y aparece al agrandarse la barra */}
            <div className="opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none">
              <Suspense
                fallback={
                  <span className="text-xs text-gray-500">
                    Cargando sesión...
                  </span>
                }
              >
                <SessionHeader />
              </Suspense>
            </div>

          </div>

        </header>

        {/* pt-24 deja espacio para que la barra, aun agrandada, no tape el contenido */}
        <main className="flex-1 flex flex-col pt-24">
          {children}
        </main>

      </body>
    </html>
  );
}