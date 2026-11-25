"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SucursalItem {
  slug: string;
  nombre: string;
}

interface ReportesLayoutProps {
  children: React.ReactNode;
  sucursales?: SucursalItem[];
}

export default function ReportesLayout({
  children,
  sucursales = [],
}: ReportesLayoutProps) {
  const pathname = usePathname();
  const [desplegado, setDesplegado] = useState(true);

  const basePath = "/Inicio/Admin_resources/reportes";
  const esTotales = pathname.startsWith(`${basePath}/ventas_totales`);

  return (
    <div className="min-h-screen text-white flex flex-col font-sans">
      <div className="flex-1 p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* MINI MENÚ DE NAVEGACIÓN A LA IZQUIERDA */}
        <aside className="lg:col-span-3 flex flex-col gap-3 pt-2">
          <Link
            href={`${basePath}/ventas_totales`}
            className={`text-sm font-medium transition-colors ${
              esTotales
                ? "text-[#d9a441]"
                : "text-gray-300 hover:text-white"
            }`}
          >
            &gt; Ventas Totales
          </Link>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setDesplegado((prev) => !prev)}
              className="text-left text-sm font-medium text-gray-200 hover:text-white transition-colors cursor-pointer"
            >
              &gt; Ventas Por Sucursal
            </button>

            {desplegado && sucursales.length > 0 && (
              <div className="flex flex-col gap-2 pl-5 pt-0.5">
                {sucursales.map((suc) => {
                  const href = `${basePath}/ventas_por_sucursal/${suc.slug}`;
                  const activa = pathname === href;

                  return (
                    <Link
                      key={suc.slug}
                      href={href}
                      className={`text-sm transition-colors ${
                        activa
                          ? "text-[#d9a441] font-medium"
                          : "text-gray-300 hover:text-white"
                      }`}
                    >
                      &gt; {suc.nombre}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        {/* ESPACIO A LA DERECHA PARA EL PAGE DE CADA REPORTE */}
        <section className="lg:col-span-9 w-full">{children}</section>
      </div>
    </div>
  );
}