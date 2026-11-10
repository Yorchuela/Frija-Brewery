
export default function Home() {
  return (
    <div className="min-h-screen bg-[#202521] text-white flex flex-col font-sans">

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        
        {/* TÍTULO Y RUTA DE ACCESO */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Inicio</h1>
            <p className="text-sm text-gray-400 mt-1">Actividad Reciente</p>
          </div>
          <span className="text-sm text-[#d9a441] font-medium hover:underline cursor-pointer">
            &gt; Administración De Recursos
          </span>
        </div>

        {/* DISTRIBUCIÓN EN 2 COLUMNAS (GRID) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* COLUMNA IZQUIERDA: Actividad Reciente */}
          <div className="lg:col-span-6 bg-[#2a302b] p-6 rounded-xl border border-gray-800 flex flex-col gap-4">
            
            {/* Elemento de actividad 1 */}
            <div className="bg-[#323933] p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 bg-white rounded-sm"></div>
                <div>
                  <p className="text-sm font-semibold">Factura Emitida</p>
                  <p className="text-xs text-gray-400">Cliente: Cliente 1 &nbsp;&nbsp;&nbsp; Sucursal: Sucursal 1</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">hace 25 minutos</span>
            </div>

            {/* Elemento de actividad 2 */}
            <div className="bg-[#323933] p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 bg-white rounded-sm"></div>
                <div>
                  <p className="text-sm font-semibold">Factura Emitida</p>
                  <p className="text-xs text-gray-400">Cliente: Cliente 1 &nbsp;&nbsp;&nbsp; Sucursal: Sucursal 1</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">hace 50 minutos</span>
            </div>

            {/* Elemento de actividad 3 */}
            <div className="bg-[#323933] p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 bg-white rounded-sm"></div>
                <div>
                  <p className="text-sm font-semibold">Cobranza Registrada</p>
                  <p className="text-xs text-gray-400">Cliente: Cliente 1 &nbsp;&nbsp;&nbsp; Sucursal: Sucursal 1</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">hace 2 horas</span>
            </div>

          </div>

          {/* COLUMNA DERECHA: Sucursales activas y Acciones Rápidas */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            
            {/* Panel de Sucursales Activas */}
            <div className="bg-[#2a302b] p-6 rounded-xl border border-gray-800">
              <h2 className="text-lg font-semibold mb-4">Sucursales activas</h2>
              <div className="flex flex-col gap-3">
                <div className="h-14 bg-[#39423b] rounded-lg"></div>
                <div className="h-14 bg-[#39423b] rounded-lg"></div>
              </div>
            </div>

            {/* Acciones Rápidas */}
            <div>
              <p className="text-sm font-medium text-gray-400 mb-3">Acciones Rapidas</p>
              <div className="grid grid-cols-4 gap-3">
                
                {/* Botón Acción 1 */}
                <div className="bg-[#2a302b] border border-gray-800 p-3 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#d9a441] transition-colors">
                  <span className="text-[#d9a441] text-xl mb-1">📊</span>
                  <span className="text-xs text-gray-300">Ver Reporte de Ventas</span>
                </div>

                {/* Botón Acción 2 */}
                <div className="bg-[#2a302b] border border-gray-800 p-3 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#d9a441] transition-colors">
                  <span className="text-[#d9a441] text-xl mb-1">📉</span>
                  <span className="text-xs text-gray-300">Productos Stock Bajo</span>
                </div>

                {/* Botón Acción 3 */}
                <div className="bg-[#2a302b] border border-gray-800 p-3 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#d9a441] transition-colors">
                  <span className="text-[#d9a441] text-xl mb-1">👤</span>
                  <span className="text-xs text-gray-300">Personal Activo</span>
                </div>

                {/* Botón Acción 4 */}
                <div className="bg-[#2a302b] border border-gray-800 p-3 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#d9a441] transition-colors">
                  <span className="text-[#d9a441] text-xl mb-1">📦</span>
                  <span className="text-xs text-gray-300">Importaciones Pendientes</span>
                </div>

              </div>
            </div>

          </div>

        </div>
      </main>

    </div>
  );
}