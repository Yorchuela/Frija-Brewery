"use client";

import { useState } from "react";

export type DatoBarraVenta = {
  etiqueta: string;
  total: number;
};

export type VentaProducto = {
  id: number | string;
  nombre: string;
  ventasTotales: number;
};

interface GraficoVentasTotalesProps {
  datos?: DatoBarraVenta[];
  productos?: VentaProducto[];
}

export default function GraficoVentasTotales({
  datos = [],
  productos = [],
}: GraficoVentasTotalesProps) {
  const [barraHover, setBarraHover] = useState<number | null>(null);

  const listaDatos = datos ?? [];
  const listaProductos = productos ?? [];

  const valorMaximo =
    listaDatos.length > 0
      ? Math.max(...listaDatos.map((d) => d.total), 1)
      : 1;

  return (
    <div className="flex flex-col gap-12">
      {/* GRÁFICO DE BARRAS FUNCIONAL */}
      <section aria-label="Gráfico de Ventas Totales">
        {listaDatos.length === 0 ? (
          <div className="h-64 flex flex-col justify-end">
            <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
              No hay datos de ventas registrados para graficar.
            </div>
            <div className="h-[2px] w-full bg-[#d9a441]" />
          </div>
        ) : (
          <div className="w-full">
            {/* Área de barras + línea base amarilla */}
            <div className="relative h-64 flex items-end justify-around gap-4 px-6 border-b-2 border-[#d9a441]">
              {listaDatos.map((item, idx) => {
                const porcentajeAltura = Math.max(
                  Math.round((item.total / valorMaximo) * 100),
                  4
                );
                const estaEnHover = barraHover === idx;

                return (
                  <div
                    key={`${item.etiqueta}-${idx}`}
                    onMouseEnter={() => setBarraHover(idx)}
                    onMouseLeave={() => setBarraHover(null)}
                    className="relative flex flex-col items-center justify-end h-full flex-1 max-w-[4.5rem] group cursor-pointer"
                  >
                    {/* Tooltip con el valor exacto */}
                    <div
                      className={`mb-2 px-2.5 py-1 rounded bg-[#2a302b] border border-[#d9a441] text-xs font-semibold text-[#f4cd78] whitespace-nowrap shadow-lg transition-all duration-150 ${
                        estaEnHover
                          ? "opacity-100 -translate-y-0.5"
                          : "opacity-0 translate-y-1 pointer-events-none"
                      }`}
                    >
                      ${item.total.toLocaleString("es-MX")}
                    </div>

                    {/* Barra amarilla proporcional */}
                    <div
                      style={{ height: `${porcentajeAltura}%` }}
                      className="w-7 sm:w-8 bg-[#f7b538] group-hover:bg-[#ffd06b] rounded-t-md transition-all duration-500 ease-out"
                    />
                  </div>
                );
              })}
            </div>

            {/* Etiquetas de días */}
            <div className="flex items-center justify-around gap-4 px-6 pt-3">
              {listaDatos.map((item, idx) => (
                <span
                  key={`label-${item.etiqueta}-${idx}`}
                  className={`flex-1 max-w-[4.5rem] text-center text-xs sm:text-sm transition-colors ${
                    barraHover === idx
                      ? "text-[#f7b538] font-medium"
                      : "text-gray-300"
                  }`}
                >
                  {item.etiqueta}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* TABLA INFERIOR: Ventas por Productos */}
      <section aria-label="Ventas por Productos" className="max-w-md">
        <h2 className="text-lg italic font-medium text-gray-100 mb-4">
          Ventas por Productos
        </h2>

        {listaProductos.length === 0 ? (
          <p className="text-sm text-gray-400">
            No hay ventas por producto registradas.
          </p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs italic font-semibold text-gray-200">
                <th className="pb-3 pr-8">Nombre</th>
                <th className="pb-3">Ventas Totales</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-300">
              {listaProductos.map((prod) => (
                <tr
                  key={prod.id}
                  className="hover:text-[#f7b538] transition-colors"
                >
                  <td className="py-1.5 pr-8">{prod.nombre}</td>
                  <td className="py-1.5 pl-4">{prod.ventasTotales}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}