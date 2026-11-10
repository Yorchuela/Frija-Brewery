'use client';

import { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';

type Brand = {
  id: number;
  name: string;
  country: string;
  products: number;
  active: boolean;
};

const initialBrands: Brand[] = [
  { id: 1, name: 'Frija', country: 'México', products: 2, active: true },
  { id: 2, name: 'Heineken', country: 'Países Bajos', products: 1, active: true },
  { id: 3, name: 'Guinness', country: 'Irlanda', products: 1, active: true },
  { id: 4, name: 'Modelo', country: 'México', products: 0, active: true },
  { id: 5, name: 'Corona', country: 'México', products: 0, active: false },
];

export default function MarcasPage() {
  const [brands, setBrands] = useState<Brand[]>(initialBrands);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: '',
    country: '',
  });

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(search.toLowerCase()) ||
    brand.country.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newBrand: Brand = {
      id: Date.now(),
      name: form.name.trim(),
      country: form.country.trim(),
      products: 0,
      active: true,
    };

    setBrands((previous) => [...previous, newBrand]);
    setForm({ name: '', country: '' });
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
                Catálogo / Marcas
              </p>

              <h1 className="text-3xl font-bold">
                Marcas
              </h1>

              <p className="mt-1 text-sm text-gray-400">
                Administración de marcas de cerveza.
              </p>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="rounded-lg bg-[#d9a441] px-5 py-3 text-sm font-semibold text-[#202521] transition-colors hover:bg-[#e8b653]"
            >
              + Agregar marca
            </button>
          </div>

          {/* INDICADORES */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

            <div className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">
              <p className="text-sm text-gray-400">
                Total de marcas
              </p>
              <p className="mt-2 text-2xl font-bold">
                {brands.length}
              </p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">
              <p className="text-sm text-gray-400">
                Marcas activas
              </p>
              <p className="mt-2 text-2xl font-bold text-green-400">
                {brands.filter((brand) => brand.active).length}
              </p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">
              <p className="text-sm text-gray-400">
                Marcas inactivas
              </p>
              <p className="mt-2 text-2xl font-bold text-red-400">
                {brands.filter((brand) => !brand.active).length}
              </p>
            </div>

          </div>

          {/* TABLA */}
          <section className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">

            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-lg font-semibold">
                Listado de marcas
              </h2>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar marca o país..."
                className="w-full rounded-lg border border-gray-700 bg-[#202521] px-4 py-2.5 text-sm text-white outline-none focus:border-[#d9a441] sm:w-80"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-sm">

                <thead>
                  <tr className="border-b border-gray-700 text-xs uppercase text-gray-400">
                    <th className="px-4 py-4">ID</th>
                    <th className="px-4 py-4">Marca</th>
                    <th className="px-4 py-4">País de origen</th>
                    <th className="px-4 py-4">Productos</th>
                    <th className="px-4 py-4">Estado</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBrands.map((brand) => (
                    <tr
                      key={brand.id}
                      className="border-b border-gray-800 transition-colors hover:bg-white/5"
                    >
                      <td className="px-4 py-4 text-gray-400">
                        {brand.id}
                      </td>

                      <td className="px-4 py-4 font-medium">
                        {brand.name}
                      </td>

                      <td className="px-4 py-4 text-gray-300">
                        {brand.country}
                      </td>

                      <td className="px-4 py-4">
                        {brand.products}
                      </td>

                      <td className="px-4 py-4">
                        {brand.active ? (
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

              {filteredBrands.length === 0 && (
                <p className="py-10 text-center text-sm text-gray-400">
                  No se encontraron marcas.
                </p>
              )}
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Mostrando {filteredBrands.length} de {brands.length} marcas
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
                  Nueva marca
                </h2>
                <p className="mt-1 text-sm text-gray-400">
                  Registra una nueva marca de cerveza.
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
                  Nombre de la marca
                </label>

                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="Ej. Heineken"
                  className="w-full rounded-lg border border-gray-700 bg-[#202521] px-3 py-2.5 text-sm outline-none focus:border-[#d9a441]"
                />
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm text-gray-300">
                  País de origen
                </label>

                <input
                  required
                  value={form.country}
                  onChange={(e) =>
                    setForm({ ...form, country: e.target.value })
                  }
                  placeholder="Ej. México"
                  className="w-full rounded-lg border border-gray-700 bg-[#202521] px-3 py-2.5 text-sm outline-none focus:border-[#d9a441]"
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
                  Guardar marca
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
