'use client';

import { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';

const sales = [
  { month: 'Junio', amount: 18500 },
  { month: 'Julio', amount: 24300 },
  { month: 'Agosto', amount: 21800 },
  { month: 'Septiembre', amount: 31200 },
  { month: 'Octubre', amount: 28900 },
  { month: 'Noviembre', amount: 35600 },
];

const branches = [
  { name: 'Tijuana', sales: 18500, percentage: 52 },
  { name: 'Mexicali', sales: 9200, percentage: 26 },
  { name: 'Ensenada', sales: 7800, percentage: 22 },
];

export default function ReportesPage() {
  const [period, setPeriod] = useState('6 meses');

  const totalSales = sales.reduce((total, item) => total + item.amount, 0);

  const maxSales = Math.max(...sales.map(item => item.amount));

  return (
    <div className="flex min-h-screen bg-[#202521] font-sans text-white">

      {/* MENU LATERAL */}
      <div className="hidden shrink-0 md:block">
        <Sidebar />
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <main className="min-w-0 flex-1 p-5 lg:p-8">
        <div className="mx-auto max-w-7xl">

          {/* ENCABEZADO */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="mb-2 text-sm text-gray-400">
                Administración / Reportes
              </p>

              <h1 className="text-3xl font-bold">
                Reportes
              </h1>

              <p className="mt-1 text-sm text-gray-400">
                Indicadores generales y rendimiento de FRIJA.
              </p>
            </div>

            <select
              value={period}
              onChange={e => setPeriod(e.target.value)}
              className="rounded-lg border border-gray-700 bg-[#2a302b] px-4 py-3 text-sm text-white outline-none focus:border-[#d9a441]"
            >
              <option value="30 días">Últimos 30 días</option>
              <option value="3 meses">Últimos 3 meses</option>
              <option value="6 meses">Últimos 6 meses</option>
              <option value="12 meses">Últimos 12 meses</option>
            </select>
          </div>

          {/* INDICADORES */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">
              <p className="text-sm text-gray-400">Ventas registradas</p>
              <p className="mt-2 text-2xl font-bold">4</p>
              <p className="mt-1 text-xs text-gray-500">Operaciones de venta</p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">
              <p className="text-sm text-gray-400">Ingresos registrados</p>
              <p className="mt-2 text-2xl font-bold text-green-400">
                $6,300.00
              </p>
              <p className="mt-1 text-xs text-gray-500">Importe de ventas de ejemplo</p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">
              <p className="text-sm text-gray-400">Productos disponibles</p>
              <p className="mt-2 text-2xl font-bold">3</p>
              <p className="mt-1 text-xs text-gray-500">Productos con existencias</p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">
              <p className="text-sm text-gray-400">Importaciones</p>
              <p className="mt-2 text-2xl font-bold text-[#d9a441]">3</p>
              <p className="mt-1 text-xs text-gray-500">Registros de ejemplo</p>
            </div>

          </div>

          {/* GRÁFICAS */}
          <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">

            {/* VENTAS POR MES */}
            <section className="rounded-xl border border-gray-800 bg-[#2a302b] p-6">

              <div className="mb-6">
                <h2 className="text-lg font-semibold">
                  Ventas por mes
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Comportamiento de ventas durante los últimos seis meses.
                </p>
              </div>

              <div className="flex h-64 items-end justify-around gap-3 border-b border-gray-700 pb-2">

                {sales.map(item => (
                  <div
                    key={item.month}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                  >
                    <span className="text-[10px] text-gray-400">
                      ${(item.amount / 1000).toFixed(1)}k
                    </span>

                    <div
                      className="w-full max-w-12 rounded-t-md bg-[#d9a441] transition-all hover:bg-[#e8b653]"
                      style={{
                        height: `${(item.amount / maxSales) * 75}%`,
                      }}
                    />

                    <span className="text-[10px] text-gray-400">
                      {item.month.slice(0, 3)}
                    </span>
                  </div>
                ))}

              </div>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  Total del periodo
                </span>

                <span className="text-lg font-bold text-[#d9a441]">
                  ${totalSales.toLocaleString('en-US')}.00
                </span>
              </div>

            </section>

            {/* VENTAS POR SUCURSAL */}
            <section className="rounded-xl border border-gray-800 bg-[#2a302b] p-6">

              <div className="mb-6">
                <h2 className="text-lg font-semibold">
                  Rendimiento por sucursal
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Distribución de ventas por ubicación.
                </p>
              </div>

              <div className="space-y-7">

                {branches.map(branch => (
                  <div key={branch.name}>

                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {branch.name}
                      </span>

                      <span className="text-sm text-gray-300">
                        ${branch.sales.toLocaleString('en-US')}.00
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-[#202521]">
                      <div
                        className="h-full rounded-full bg-[#d9a441]"
                        style={{ width: `${branch.percentage}%` }}
                      />
                    </div>

                    <p className="mt-1 text-right text-xs text-gray-500">
                      {branch.percentage}% de las ventas
                    </p>

                  </div>
                ))}

              </div>

              <div className="mt-8 rounded-lg bg-[#202521] p-4">
                <p className="text-xs text-gray-400">
                  Sucursal con mayor participación
                </p>

                <p className="mt-1 font-semibold text-[#d9a441]">
                  Tijuana
                </p>
              </div>

            </section>

          </div>

          {/* RESUMEN DE OPERACIONES */}
          <section className="rounded-xl border border-gray-800 bg-[#2a302b] p-6">

            <h2 className="mb-5 text-lg font-semibold">
              Resumen de operaciones
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

              <div className="rounded-lg bg-[#202521] p-5">
                <p className="text-sm text-gray-400">
                  Ventas completadas
                </p>

                <p className="mt-2 text-2xl font-bold text-green-400">
                  2
                </p>
              </div>

              <div className="rounded-lg bg-[#202521] p-5">
                <p className="text-sm text-gray-400">
                  Importaciones pendientes
                </p>

                <p className="mt-2 text-2xl font-bold text-yellow-400">
                  1
                </p>
              </div>

              <div className="rounded-lg bg-[#202521] p-5">
                <p className="text-sm text-gray-400">
                  Envíos en tránsito
                </p>

                <p className="mt-2 text-2xl font-bold text-blue-400">
                  1
                </p>
              </div>

            </div>

          </section>

          <p className="mt-5 text-xs text-gray-500">
            Periodo seleccionado: {period}. Información ilustrativa para la interfaz.
          </p>

        </div>
      </main>
    </div>
  );
}
