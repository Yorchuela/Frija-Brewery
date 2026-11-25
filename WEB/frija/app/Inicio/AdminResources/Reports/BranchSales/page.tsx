import Link from "next/link";
import GraficoVentasTotales, {
  DatoBarraVenta,
  VentaProducto,
} from "./graph";

async function obtenerVentasTotalesPorDia(): Promise<DatoBarraVenta[]> {
  // Inicia vacío hasta conectar la base de datos:
  return [];

  /*
  // Descomenta para probar el gráfico con los datos de ejemplo:
  return [
    { etiqueta: "Lunes", total: 1200 },
    { etiqueta: "Martes", total: 3400 },
    { etiqueta: "Miercoles", total: 1850 },
    { etiqueta: "Jueves", total: 3200 },
    { etiqueta: "Viernes", total: 4600 },
  ];
  */
}

async function obtenerVentasPorProducto(): Promise<VentaProducto[]> {
  // Inicia vacío hasta conectar la base de datos:
  return [];

  /*
  return [
    { id: 1, nombre: "Producto1", ventasTotales: 50 },
    { id: 2, nombre: "Producto2", ventasTotales: 40 },
    { id: 3, nombre: "Producto3", ventasTotales: 30 },
  ];
  */
}

export default async function VentasTotalesPage() {
  const [ventasDia, ventasProductos] = await Promise.all([
    obtenerVentasTotalesPorDia(),
    obtenerVentasPorProducto(),
  ]);

  return (
    <div className="w-full">
      {/* TÍTULO Y BREADCRUMB */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Ventas Totales</h1>
        <p className="text-sm italic text-gray-400 mt-1">
          <Link
            href="/Inicio"
            className="hover:text-[#d9a441] transition-colors"
          >
            Inicio
          </Link>{" "}
          &gt;{" "}
          <Link
            href="/Inicio/Admin_resources"
            className="hover:text-[#d9a441] transition-colors"
          >
            Administración
          </Link>{" "}
          &gt; <span>Reportes</span> &gt; <span>Ventas Totales</span>
        </p>
      </div>

      {/* GRÁFICO Y TABLA */}
      <GraficoVentasTotales datos={ventasDia} productos={ventasProductos} />
    </div>
  );
}