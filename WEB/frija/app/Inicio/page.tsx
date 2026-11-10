import Sidebar from '../../components/layout/Sidebar';

export default function Home() {
  return (
    <div className="flex min-h-screen bg-[#202521] font-sans text-white">

      {/* MENU LATERAL */}
      <div className="hidden shrink-0 md:block">
        <Sidebar />
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <main className="min-w-0 flex-1 p-5 lg:p-8">
        <div className="mx-auto w-full max-w-7xl">

          {/* TITULO Y RUTA */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Inicio
              </h1>
              <p className="mt-1 text-sm text-gray-400">
                Actividad Reciente
              </p>
            </div>

            <span className="text-sm font-medium text-[#d9a441]">
              Administración de Recursos
            </span>
          </div>

          {/* DISTRIBUCION EN DOS COLUMNAS */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

            {/* ACTIVIDAD RECIENTE */}
            <section className="flex flex-col gap-4 rounded-xl border border-gray-800 bg-[#2a302b] p-6 lg:col-span-6">
              <h2 className="text-lg font-semibold">
                Actividad reciente
              </h2>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-[#323933] p-4">
                <div className="flex items-center gap-4">
                  <div className="h-6 w-6 rounded-sm bg-white"></div>
                  <div>
                    <p className="text-sm font-semibold">
                      Factura Emitida
                    </p>
                    <p className="text-xs text-gray-400">
                      Cliente: Cliente 1 | Sucursal: Sucursal 1
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  hace 25 minutos
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-[#323933] p-4">
                <div className="flex items-center gap-4">
                  <div className="h-6 w-6 rounded-sm bg-white"></div>
                  <div>
                    <p className="text-sm font-semibold">
                      Factura Emitida
                    </p>
                    <p className="text-xs text-gray-400">
                      Cliente: Cliente 1 | Sucursal: Sucursal 1
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  hace 50 minutos
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-[#323933] p-4">
                <div className="flex items-center gap-4">
                  <div className="h-6 w-6 rounded-sm bg-white"></div>
                  <div>
                    <p className="text-sm font-semibold">
                      Cobranza Registrada
                    </p>
                    <p className="text-xs text-gray-400">
                      Cliente: Cliente 1 | Sucursal: Sucursal 1
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  hace 2 horas
                </span>
              </div>
            </section>

            {/* COLUMNA DERECHA */}
            <div className="flex flex-col gap-6 lg:col-span-6">

              {/* SUCURSALES */}
              <section className="rounded-xl border border-gray-800 bg-[#2a302b] p-6">
                <h2 className="mb-4 text-lg font-semibold">
                  Sucursales activas
                </h2>

                <div className="flex flex-col gap-3">
                  <div className="h-14 rounded-lg bg-[#39423b]"></div>
                  <div className="h-14 rounded-lg bg-[#39423b]"></div>
                </div>
              </section>

              {/* ACCIONES RAPIDAS */}
              <section>
                <h2 className="mb-3 text-sm font-medium text-gray-400">
                  Acciones Rápidas
                </h2>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                  <div className="flex flex-col items-center justify-center rounded-lg border border-gray-800 bg-[#2a302b] p-3 text-center transition-colors hover:border-[#d9a441]">
                    <span className="mb-1 text-xl text-[#d9a441]">
                      ▥
                    </span>
                    <span className="text-xs text-gray-300">
                      Ver Reporte de Ventas
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center rounded-lg border border-gray-800 bg-[#2a302b] p-3 text-center transition-colors hover:border-[#d9a441]">
                    <span className="mb-1 text-xl text-[#d9a441]">
                      ▣
                    </span>
                    <span className="text-xs text-gray-300">
                      Productos Stock Bajo
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center rounded-lg border border-gray-800 bg-[#2a302b] p-3 text-center transition-colors hover:border-[#d9a441]">
                    <span className="mb-1 text-xl text-[#d9a441]">
                      ♙
                    </span>
                    <span className="text-xs text-gray-300">
                      Personal Activo
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center rounded-lg border border-gray-800 bg-[#2a302b] p-3 text-center transition-colors hover:border-[#d9a441]">
                    <span className="mb-1 text-xl text-[#d9a441]">
                      ⇩
                    </span>
                    <span className="text-xs text-gray-300">
                      Importaciones Pendientes
                    </span>
                  </div>

                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
