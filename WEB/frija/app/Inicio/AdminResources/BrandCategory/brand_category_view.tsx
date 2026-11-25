"use client";

import { useState } from "react";
import Link from "next/link";
import ElementoBloque, { ElementoCatalogo } from "./brand_category_list";

interface MarcasCategoriasVistaProps {
  marcasIniciales?: ElementoCatalogo[];
  categoriasIniciales?: ElementoCatalogo[];
}

export default function MarcasCategoriasVista({
  marcasIniciales = [],
  categoriasIniciales = [],
}: MarcasCategoriasVistaProps) {
  const [busqueda, setBusqueda] = useState("");

  const listaMarcas = marcasIniciales ?? [];
  const listaCategorias = categoriasIniciales ?? [];

  const marcasFiltradas = listaMarcas.filter((item) =>
    (item.nombre ?? "").toLowerCase().includes(busqueda.toLowerCase())
  );

  const categoriasFiltradas = listaCategorias.filter((item) =>
    (item.nombre ?? "").toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen text-white flex flex-col font-sans">
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        {/* ENCABEZADO */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Marcas y Categorías
            </h1>
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
              &gt; Marcas y Categorías
            </p>
          </div>

          {/* BUSCADOR Y BOTÓN AGREGAR ELEMENTO */}
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar en Marcas y Categorías"
              className="w-64 sm:w-80 bg-[#5b645c]/70 text-white placeholder:text-gray-300 placeholder:italic text-sm px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:border-[#d9a441] transition-colors"
            />

            <button
              type="button"
              onClick={() => {
                // Aquí puedes abrir tu modal para agregar marca o categoría
              }}
              className="bg-[#39423b] hover:bg-[#d9a441] text-gray-200 hover:text-[#120f0d] border border-gray-700 hover:border-[#d9a441] text-sm font-medium px-4 py-2 rounded-md transition-colors cursor-pointer"
            >
              + Agregar Elemento
            </button>
          </div>
        </div>

        {/* DOS COLUMNAS: MARCAS Y CATEGORÍAS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* COLUMNA IZQUIERDA: MARCAS */}
          <section
            aria-label="Marcas"
            className="bg-[#2a302b] rounded-xl border border-gray-800 overflow-hidden"
          >
            <div className="bg-[#39423b] px-6 py-3 border-b border-gray-700">
              <h2 className="text-sm font-medium text-gray-200">Marcas</h2>
            </div>

            <div>
              {listaMarcas.length === 0 ? (
                <p className="py-8 px-6 text-center text-sm text-gray-400">
                  No hay marcas registradas en la base de datos.
                </p>
              ) : marcasFiltradas.length === 0 ? (
                <p className="py-8 px-6 text-center text-sm text-gray-400">
                  No se encontraron marcas con &quot;{busqueda}&quot;.
                </p>
              ) : (
                marcasFiltradas.map((marca) => (
                  <ElementoBloque
                    key={marca.id}
                    id={marca.id}
                    nombre={marca.nombre}
                    activo={marca.activo}
                    onEditar={(id) => console.log("Editar marca:", id)}
                  />
                ))
              )}
            </div>
          </section>

          {/* COLUMNA DERECHA: CATEGORÍAS */}
          <section
            aria-label="Categorías"
            className="bg-[#2a302b] rounded-xl border border-gray-800 overflow-hidden"
          >
            <div className="bg-[#39423b] px-6 py-3 border-b border-gray-700">
              <h2 className="text-sm font-medium text-gray-200">Categorías</h2>
            </div>

            <div>
              {listaCategorias.length === 0 ? (
                <p className="py-8 px-6 text-center text-sm text-gray-400">
                  No hay categorías registradas en la base de datos.
                </p>
              ) : categoriasFiltradas.length === 0 ? (
                <p className="py-8 px-6 text-center text-sm text-gray-400">
                  No se encontraron categorías con &quot;{busqueda}&quot;.
                </p>
              ) : (
                categoriasFiltradas.map((categoria) => (
                  <ElementoBloque
                    key={categoria.id}
                    id={categoria.id}
                    nombre={categoria.nombre}
                    activo={categoria.activo}
                    onEditar={(id) => console.log("Editar categoría:", id)}
                  />
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}