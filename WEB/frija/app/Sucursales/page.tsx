'use client';

import { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';

type Branch = {
  id: number;
  name: string;
  city: string;
  address: string;
  phone: string;
  manager: string;
  active: boolean;
};

const initialBranches: Branch[] = [
  {
    id: 1,
    name: 'Sucursal Tijuana',
    city: 'Tijuana',
    address: 'Zona Río, Av. Paseo de los Héroes',
    phone: '6641234567',
    manager: 'Carlos Martínez',
    active: true,
  },
  {
    id: 2,
    name: 'Sucursal Mexicali',
    city: 'Mexicali',
    address: 'Centro Cívico, Calz. Independencia',
    phone: '6861234567',
    manager: 'Ana Rodríguez',
    active: true,
  },
  {
    id: 3,
    name: 'Sucursal Ensenada',
    city: 'Ensenada',
    address: 'Zona Centro, Av. Reforma',
    phone: '6461234567',
    manager: 'Luis Hernández',
    active: true,
  },
  {
    id: 4,
    name: 'Sucursal Tecate',
    city: 'Tecate',
    address: 'Col. Primera',
    phone: '6651234567',
    manager: 'María González',
    active: false,
  },
];

export default function SucursalesPage() {
  const [branches, setBranches] = useState<Branch[]>(initialBranches);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: '',
    city: '',
    address: '',
    phone: '',
    manager: '',
  });

  const filteredBranches = branches.filter(branch =>
    branch.name.toLowerCase().includes(search.toLowerCase()) ||
    branch.city.toLowerCase().includes(search.toLowerCase()) ||
    branch.manager.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newBranch: Branch = {
      id: Date.now(),
      name: form.name.trim(),
      city: form.city.trim(),
      address: form.address.trim(),
      phone: form.phone.trim(),
      manager: form.manager.trim(),
      active: true,
    };

    setBranches(previous => [...previous, newBranch]);

    setForm({
      name: '',
      city: '',
      address: '',
      phone: '',
      manager: '',
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
                Logística / Sucursales
              </p>

              <h1 className="text-3xl font-bold">
                Sucursales
              </h1>

              <p className="mt-1 text-sm text-gray-400">
                Administración de puntos de operación de FRIJA.
              </p>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="rounded-lg bg-[#d9a441] px-5 py-3 text-sm font-semibold text-[#202521] transition-colors hover:bg-[#e8b653]"
            >
              + Agregar sucursal
            </button>
          </div>

          {/* INDICADORES */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

            <div className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">
              <p className="text-sm text-gray-400">
                Total de sucursales
              </p>

              <p className="mt-2 text-2xl font-bold">
                {branches.length}
              </p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">
              <p className="text-sm text-gray-400">
                Sucursales activas
              </p>

              <p className="mt-2 text-2xl font-bold text-green-400">
                {branches.filter(branch => branch.active).length}
              </p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">
              <p className="text-sm text-gray-400">
                Sucursales inactivas
              </p>

              <p className="mt-2 text-2xl font-bold text-red-400">
                {branches.filter(branch => !branch.active).length}
              </p>
            </div>

          </div>

          {/* TABLA */}
          <section className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">

            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-lg font-semibold">
                Directorio de sucursales
              </h2>

              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar sucursal, ciudad o responsable..."
                className="w-full rounded-lg border border-gray-700 bg-[#202521] px-4 py-2.5 text-sm text-white outline-none focus:border-[#d9a441] sm:w-80"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left text-sm">

                <thead>
                  <tr className="border-b border-gray-700 text-xs uppercase text-gray-400">
                    <th className="px-4 py-4">Sucursal</th>
                    <th className="px-4 py-4">Ciudad</th>
                    <th className="px-4 py-4">Dirección</th>
                    <th className="px-4 py-4">Teléfono</th>
                    <th className="px-4 py-4">Responsable</th>
                    <th className="px-4 py-4">Estado</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBranches.map(branch => (
                    <tr
                      key={branch.id}
                      className="border-b border-gray-800 transition-colors hover:bg-white/5"
                    >
                      <td className="px-4 py-4 font-medium">
                        {branch.name}
                      </td>

                      <td className="px-4 py-4 text-gray-300">
                        {branch.city}
                      </td>

                      <td className="px-4 py-4 text-gray-300">
                        {branch.address}
                      </td>

                      <td className="px-4 py-4 text-gray-300">
                        {branch.phone}
                      </td>

                      <td className="px-4 py-4 text-gray-300">
                        {branch.manager}
                      </td>

                      <td className="px-4 py-4">
                        {branch.active ? (
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

              {filteredBranches.length === 0 && (
                <p className="py-10 text-center text-sm text-gray-400">
                  No se encontraron sucursales.
                </p>
              )}
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Mostrando {filteredBranches.length} de {branches.length} sucursales
            </p>

          </section>
        </div>
      </main>

      {/* FORMULARIO */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4">

          <div className="my-auto w-full max-w-xl rounded-xl border border-gray-700 bg-[#2a302b] p-6">

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  Nueva sucursal
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  Registra una nueva ubicación de FRIJA.
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
                  Nombre de la sucursal
                </label>

                <input
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Ej. Sucursal Tijuana"
                  className="w-full rounded-lg border border-gray-700 bg-[#202521] px-3 py-2.5 text-sm outline-none focus:border-[#d9a441]"
                />
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm text-gray-300">
                  Ciudad
                </label>

                <input
                  required
                  value={form.city}
                  onChange={e => setForm({ ...form, city: e.target.value })}
                  placeholder="Ej. Tijuana"
                  className="w-full rounded-lg border border-gray-700 bg-[#202521] px-3 py-2.5 text-sm outline-none focus:border-[#d9a441]"
                />
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm text-gray-300">
                  Dirección
                </label>

                <input
                  required
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  placeholder="Dirección de la sucursal"
                  className="w-full rounded-lg border border-gray-700 bg-[#202521] px-3 py-2.5 text-sm outline-none focus:border-[#d9a441]"
                />
              </div>

              <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Teléfono
                  </label>

                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="Número de teléfono"
                    className="w-full rounded-lg border border-gray-700 bg-[#202521] px-3 py-2.5 text-sm outline-none focus:border-[#d9a441]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Responsable
                  </label>

                  <input
                    required
                    value={form.manager}
                    onChange={e => setForm({ ...form, manager: e.target.value })}
                    placeholder="Nombre del responsable"
                    className="w-full rounded-lg border border-gray-700 bg-[#202521] px-3 py-2.5 text-sm outline-none focus:border-[#d9a441]"
                  />
                </div>
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
                  Guardar sucursal
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
