import Link from "next/link";
import { Suspense } from "react";
import SessionHeader from "../components/SessionHeader";

// Este layout envuelve todas las páginas dentro de /Inicio (la sesión iniciada).
export default function InicioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* FONDO GLOBAL: negro profundo con reflejos sutiles y volúmenes oscuros */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-[#070708] via-[#0c0c0e] to-[#050506]"
      >
        <div className="absolute -top-24 left-1/4 h-[34rem] w-[34rem] rounded-full bg-white/[0.045] blur-[130px]" />
        <div className="absolute top-1/4 -right-24 h-[28rem] w-[28rem] rounded-full bg-[#2a2b2e]/30 blur-[120px]" />
        <div className="absolute -bottom-32 left-1/3 h-[32rem] w-[32rem] rounded-full bg-[#18181b]/50 blur-[140px]" />
      </div>

      {/* HEADER: barra compacta de ancho completo, semitransparente en reposo y opaca con hover o foco */}
      <header className="fixed inset-x-0 top-0 z-50">
        <div
          tabIndex={0}
          className="group flex w-full items-center justify-between bg-[#fcfbf9]/40 px-6 py-1.5 backdrop-blur-xl outline-none transition-colors duration-300 ease-out hover:bg-[#fcfbf9] focus-within:bg-[#fcfbf9] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#d9a441] motion-reduce:transition-none"
        >
          <img
            src="/Images/logo_gral.png"
            alt="LOGO_GRAL FRIJA"
            className="h-auto w-28 shrink-0"
          />

          {/* Sesión · Cerrar sesión: en una sola fila, aparecen con hover o foco */}
          <div className="flex items-center gap-3 whitespace-nowrap text-xs leading-tight opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none">
            <Suspense
              fallback={
                <span className="text-xs text-gray-500">
                  Cargando sesión...
                </span>
              }
            >
              <SessionHeader />
            </Suspense>

            <span aria-hidden className="h-4 w-px bg-gray-400/60" />

            <Link
              href="/"
              className="font-medium text-red-700 transition-colors hover:text-red-500 hover:underline"
            >
              Cerrar sesión
            </Link>
          </div>
        </div>
      </header>

      {/* pt-16 deja espacio para que la barra no tape el contenido */}
      <div className="flex-1 flex flex-col pt-16">
        {children}
      </div>
    </>
  );
}