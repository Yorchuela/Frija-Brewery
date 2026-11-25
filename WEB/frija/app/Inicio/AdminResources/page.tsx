import Link from "next/link";

interface TarjetaRecurso {
  id: string;
  titulo: string;
  icono: string;
  href: string;
  destacada?: boolean;
}

const recursosPrincipales: TarjetaRecurso[] = [
  {
    id: "usuarios",
    titulo: "Usuarios",
    icono: "👤",
    href: "/Inicio/AdminResources/Users",
    destacada: true,
  },
  {
    id: "proveedores",
    titulo: "Proveedores",
    icono: "🚚",
    href: "/Inicio/AdminResources/Suppliers",
  },
  {
    id: "sucursales",
    titulo: "Sucursales",
    icono: "🏪",
    href: "/Inicio/AdminResources/Branches",
  },
  {
    id: "marcas-categorias",
    titulo: "Marcas y Categorias",
    icono: "🗂️",
    href: "/Inicio/AdminResources/BrandCategory",
  },
  {
    id: "productos",
    titulo: "Productos",
    icono: "📦",
    href: "/administracion/productos",
  },
];

const reportesRecursos: TarjetaRecurso[] = [
  {
    id: "reporte-ventas",
    titulo: "Ventas",
    icono: "📉",
    href: "/Inicio/AdminResources/Reports/OverallSales",
  },
  {
    id: "reporte-productos",
    titulo: "Productos",
    icono: "📄",
    href: "/administracion/reportes/productos",
  },
  {
    id: "reporte-importaciones",
    titulo: "Importaciones",
    icono: "🔄",
    href: "/administracion/reportes/importaciones",
  },
];

export default function AdministracionRecursosPage() {
  return (
    <div className="min-h-screen text-white flex flex-col font-sans">
      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        {/* TÍTULO Y RUTA DE ACCESO */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Administración de Recursos
          </h1>
          <p className="text-sm italic text-gray-400 mt-1">
            <Link href="/Inicio" className="hover:text-[#d9a441] transition-colors">
              Inicio
            </Link>{" "}
            &gt; Administración
          </p>
        </div>

        {/* SECCIÓN SUPERIOR: Módulos principales */}
        <section aria-label="Módulos de administración" className="mb-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {recursosPrincipales.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`group rounded-xl border p-5 h-36 flex flex-col items-center justify-between text-center transition-colors ${
                  item.destacada
                    ? "bg-[#d9a441] border-[#d9a441] text-[#120f0d]"
                    : "bg-[#2a302b] border-gray-800 text-gray-200 hover:bg-[#d9a441] hover:border-[#d9a441] hover:text-[#120f0d]"
                }`}
              >
                <span
                  className={`text-4xl transition-transform duration-200 group-hover:scale-105 ${
                    item.destacada ? "text-[#120f0d]" : "text-[#d9a441]"
                  }`}
                >
                  {item.icono}
                </span>
                <span className="text-sm font-medium leading-tight">
                  {item.titulo}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* SECCIÓN INFERIOR: Reportes */}
        <section aria-label="Reportes">
          <h2 className="text-base font-medium text-gray-300 mb-4">Reportes</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {reportesRecursos.map((reporte) => (
              <Link
                key={reporte.id}
                href={reporte.href}
                className="group bg-[#2a302b] border border-gray-800 rounded-xl p-5 h-36 flex flex-col items-center justify-between text-center text-gray-200 transition-colors hover:bg-[#d9a441] hover:border-[#d9a441] hover:text-[#120f0d]"
              >
                <span className="text-4xl text-[#d9a441] transition-transform duration-200 group-hover:scale-105">
                  {reporte.icono}
                </span>
                <span className="text-sm font-medium leading-tight">
                  {reporte.titulo}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}