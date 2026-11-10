'use client';

import { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';

type Category = {
  id: number;
  name: string;
  description: string;
  products: number;
  active: boolean;
};

const initialCategories: Category[] = [
  {
    id: 1,
    name: 'Lager',
    description: 'Cervezas de fermentación baja y sabor ligero.',
    products: 2,
    active: true,
  },
  {
    id: 2,
    name: 'IPA',
    description: 'Cervezas con mayor presencia de lúpulo.',
    products: 1,
    active: true,
  },
  {
    id: 3,
    name: 'Stout',
    description: 'Cervezas oscuras con notas tostadas.',
    products: 1,
    active: true,
  },
  {
    id: 4,
    name: 'Ale',
    description: 'Cervezas de fermentación alta.',
    products: 0,
    active: true,
  },
  {
    id: 5,
    name: 'Porter',
    description: 'Cervezas oscuras con sabores maltosos.',
    products: 0,
    active: false,
  },
];

export default function CategoriasPage() {
  const [categories, setCategories] =
    useState<Category[]>(initialCategories);

  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
  });

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase()) ||
    category.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newCategory: Category = {
      id: Date.now(),
      name: form.name.trim(),
      description: form.description.trim(),
      products: 0,
      active: true,
    };

    setCategories((previous) => [...previous, newCategory]);

    setForm({
      name: '',
      description: '',
    });

    setShowForm(false);
  };

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
                Catálogo / Categorías
              </p>

              <h1 className="text-3xl font-bold">
                Categorías
              </h1>

              <p className="mt-1 text-sm text-gray-400">
                Administración de categorías de productos.
              </p>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="rounded-lg bg-[#d9a441] px-5 py-3 text-sm font-semibold text-[#202521] transition-colors hover:bg-[#e8b653]"
            >
              + Agregar categoría
            </button>
          </div>

          {/* INDICADORES */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

            <div className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">
              <p className="text-sm text-gray-400">
                Total de categorías
              </p>
              <p className="mt-2 text-2xl font-bold">
                {categories.length}
              </p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">
              <p className="text-sm text-gray-400">
                Categorías activas
              </p>
              <p className="mt-2 text-2xl font-bold text-green-400">
                {categories.filter((category) => category.active).length}
              </p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">
              <p className="text-sm text-gray-400">
                Categorías inactivas
              </p>
              <p className="mt-2 text-2xl font-bold text-red-400">
                {categories.filter((category) => !category.active).length}
              </p>
            </div>

          </div>

          {/* TABLA */}
          <section className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">

            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-lg font-semibold">
                Listado de categorías
              </h2>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar categoría..."
                className="w-full rounded-lg border border-gray-700 bg-[#202521] px-4 py-2.5 text-sm text-white outline-none focus:border-[#d9a441] sm:w-80"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left text-sm">

                <thead>
                  <tr className="border-b border-gray-700 text-xs uppercase text-gray-400">
                    <th className="px-4 py-4">ID</th>
                    <th className="px-4 py-4">Categoría</th>
                    <th className="px-4 py-4">Descripción</th>
                    <th className="px-4 py-4">Productos</th>
                    <th className="px-4 py-4">Estado</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCategories.map((category) => (
                    <tr
                      key={category.id}
                      className="border-b border-gray-800 transition-colors hover:bg-white/5"
                    >
                      <td className="px-4 py-4 text-gray-400">
                        {category.id}
                      </td>

                      <td className="px-4 py-4 font-medium">
                        {category.name}
                      </td>

                      <td className="max-w-sm px-4 py-4 text-gray-300">
                        {category.description}
                      </td>

                      <td className="px-4 py-4">
                        {category.products}
                      </td>

                      <td className="px-4 py-4">
                        {category.active ? (
                          <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                            Activa
                          </span>
                        ) : (
                          <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
                            Inactiva
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>

              {filteredCategories.length === 0 && (
                <p className="py-10 text-center text-sm text-gray-400">
                  No se encontraron categorías.
                </p>
              )}
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Mostrando {filteredCategories.length} de {categories.length} categorías
            </p>

          </section>
        </div>
      </main>

      {/* FORMULARIO */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4">

          <div className="my-auto w-full max-w-lg rounded-xl border border-gray-700 bg-[#2a302b] p-6">

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  Nueva categoría
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  Registra un nuevo tipo de cerveza.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-xl text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="mb-4">
                <label className="mb-2 block text-sm text-gray-300">
                  Nombre de la categoría
                </label>

                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="Ej. Lager"
                  className="w-full rounded-lg border border-gray-700 bg-[#202521] px-3 py-2.5 text-sm outline-none focus:border-[#d9a441]"
                />
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm text-gray-300">
                  Descripción
                </label>

                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Describe la categoría..."
                  className="w-full resize-none rounded-lg border border-gray-700 bg-[#202521] px-3 py-2.5 text-sm outline-none focus:border-[#d9a441]"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-gray-600 px-5 py-2.5 text-sm text-gray-300 hover:bg-white/5"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-[#d9a441] px-5 py-2.5 text-sm font-semibold text-[#202521] hover:bg-[#e8b653]"
                >
                  Guardar categoría
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
