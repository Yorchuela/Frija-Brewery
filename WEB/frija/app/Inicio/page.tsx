import BloqueActividad from "./actividad_bloque";

// 1. Define la forma de los datos que devuelve tu base de datos
interface Actividad {
  id: number;
  nombre: string;
  cliente: string;
  sucursal: string;
  hora: string; // o Date si formateas la fecha aquí
}

async function obtenerActividades(): Promise<Actividad[]> {
  // Datos de ejemplo (mock)
  return [
    {
      id: 1,
      nombre: "Factura Emitida",
      cliente: "Distribuidora Norte",
      sucursal: "Sucursal Centro",
      hora: "hace 15 minutos",
    },
    {
      id: 2,
      nombre: "Orden de Compra Aprobada",
      cliente: "Comercial del Pacífico",
      sucursal: "Sucursal Tijuana",
      hora: "hace 42 minutos",
    },
    {
      id: 3,
      nombre: "Entrada de Inventario",
      cliente: "Almacén Principal",
      sucursal: "Sucursal Bodega",
      hora: "hace 1 hora",
    },
    {
      id: 4,
      nombre: "Pago Registrado",
      cliente: "Abarrotes El Sol",
      sucursal: "Sucursal Centro",
      hora: "hace 2 horas",
    },
  ];
}

export default async function Home() {
  const actividades = await obtenerActividades();

  return (
    <div className="min-h-screen text-white flex flex-col font-sans">
      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        {/* TÍTULO Y RUTA DE ACCESO */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Inicio</h1>
            <p className="text-sm text-gray-400 mt-1">Actividad Reciente</p>
          </div>
          <span className="text-sm text-[#d9a441] font-medium hover:underline cursor-pointer">
            <a href="\Inicio\Admin_resources">&gt; Administración De Recursos</a>
          </span>
        </div>

        {/*SECCION IZQ*/}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Actividad Reciente -------------------------------------------->*/}
          <div className="lg:col-span-6 bg-[#2a302b] p-6 rounded-xl border border-gray-800 flex flex-col gap-4">
            {actividades.length === 0 ? (
              <p className="text-sm text-gray-400">
                No hay actividad reciente para mostrar.
              </p>
            ) : (
              actividades.map((item) => (
                <BloqueActividad
                  key={item.id}
                  id={item.id}
                  nombre={item.nombre}
                  cliente={item.cliente}
                  sucursal={item.sucursal}
                  hora={item.hora}
                />
              ))
            )}
            <p>Ver todos</p>
          </div>

          {/*SECCION DER*/}
          <div className="lg:col-span-6 flex flex-col gap-6">

            {/*Sucursales activas --------------------------------> */}
            <div className="bg-a[#2a302b] p-6 rounded-xl border border-gray-800">
              <h2 className="text-lg font-semibold mb-4">Sucursales activas</h2>
              <div className="flex flex-col gap-3">
                <div className="h-14 bg-[#39423b] rounded-lg"></div>
                <div className="h-14 bg-[#39423b] rounded-lg"></div>
              </div>
            </div>

            {/* Acciones Rápidas ------------------------------> */}
            <div>
              <p className="text-sm font-medium text-gray-400 mb-3">
                Acciones Rapidas
              </p>

              <div className="grid grid-cols-4 gap-3">
                {/* Botón Ver Reporte de Ventas ---------------------------> */}
                <div className="group bg-[#2a302b] border border-gray-800 p-3 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#d9a441] hover:border-[#d9a441] transition-colors">
                  <span className="text-[#d9a441] group-hover:text-[#120f0d] text-xl mb-1 transition-colors">
                    📊
                  </span>
                  <span className="text-xs text-gray-300 group-hover:text-[#120f0d] font-medium transition-colors">
                    Ver Reporte de Ventas
                  </span>
                </div>

                {/* Botón Productos Stock Bajo ----------------------------> */}
                <div className="group bg-[#2a302b] border border-gray-800 p-3 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#d9a441] hover:border-[#d9a441] transition-colors">
                  <span className="text-[#d9a441] group-hover:text-[#120f0d] text-xl mb-1 transition-colors">
                    📉
                  </span>
                  <span className="text-xs text-gray-300 group-hover:text-[#120f0d] font-medium transition-colors">
                    Productos Stock Bajo
                  </span>
                </div>

                {/* Botón Personal Activo ---------------------------------> */}
                <div className="group bg-[#2a302b] border border-gray-800 p-3 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#d9a441] hover:border-[#d9a441] transition-colors">
                  <span className="text-[#d9a441] group-hover:text-[#120f0d] text-xl mb-1 transition-colors">
                    👤
                  </span>
                  <span className="text-xs text-gray-300 group-hover:text-[#120f0d] font-medium transition-colors">
                    Personal Activo
                  </span>
                </div>

                {/* Botón Importaciones Pendientes ------------------------> */}
                <div className="group bg-[#2a302b] border border-gray-800 p-3 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#d9a441] hover:border-[#d9a441] transition-colors">
                  <span className="text-[#d9a441] group-hover:text-[#120f0d] text-xl mb-1 transition-colors">
                    📦
                  </span>
                  <span className="text-xs text-gray-300 group-hover:text-[#120f0d] font-medium transition-colors">
                    Importaciones Pendientes
                  </span>
                </div>

              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}