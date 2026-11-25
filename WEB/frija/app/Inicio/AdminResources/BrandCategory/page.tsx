import ElementoBloque, { ElementoCatalogo } from "./brand_category_list";
import MarcasCategoriasVista from "./brand_category_view";

async function obtenerMarcas(): Promise<ElementoCatalogo[]> {
  // Inicia vacío por naturaleza hasta conectar la base de datos:
  return [];

  /*
  return [
    { id: 1, nombre: "Marca 1", activo: true },
    { id: 2, nombre: "Marca 2", activo: true },
    { id: 3, nombre: "Marca 3", activo: false },
    { id: 4, nombre: "Marca 4", activo: true },
  ];
  */
}

async function obtenerCategorias(): Promise<ElementoCatalogo[]> {
  // Inicia vacío por naturaleza hasta conectar la base de datos:
  return [];

  /*
  return [
    { id: 1, nombre: "Cat 1", activo: true },
    { id: 2, nombre: "Cat 2", activo: true },
    { id: 3, nombre: "Cat 3", activo: false },
    { id: 4, nombre: "Cat 4", activo: true },
  ];
  */
}

export default async function MarcasCategoriasPage() {
  const [marcas, categorias] = await Promise.all([
    obtenerMarcas(),
    obtenerCategorias(),
  ]);

  return (
    <MarcasCategoriasVista
      marcasIniciales={marcas}
      categoriasIniciales={categorias}
    />
  );
}