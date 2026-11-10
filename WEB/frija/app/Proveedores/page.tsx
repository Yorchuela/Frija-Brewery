'use client';

import { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';

type Supplier = {
  id: number;
  name: string;
  country: string;
  contact: string;
  email: string;
  phone: string;
  active: boolean;
};

const initialSuppliers: Supplier[] = [
  {
    id: 1,
    name: 'Heineken México',
    country: 'México',
    contact: 'Carlos Martínez',
    email: 'ventas@heineken.com',
    phone: '6641234567',
    active: true,
  },
  {
    id: 2,
    name: 'Distribuidora Modelo',
    country: 'México',
    contact: 'Ana Rodríguez',
    email: 'contacto@modelo.com',
    phone: '6861234567',
    active: true,
  },
  {
    id: 3,
    name: 'Importadora Guinness',
    country: 'Irlanda',
    contact: 'James Wilson',
    email: 'sales@guinness.com',
    phone: '5551234567',
    active: true,
  },
  {
    id: 4,
    name: 'Cervezas del Norte',
    country: 'México',
    contact: 'Luis Hernández',
    email: 'ventas@cervezasnorte.com',
    phone: '6461234567',
    active: false,
  },
];

export default function ProveedoresPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: '',
    country: '',
    contact: '',
    email: '',
    phone: '',
  });

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(search.toLowerCase()) ||
    supplier.country.toLowerCase().includes(search.toLowerCase()) ||
    supplier.contact.toLowerCase().includes(search.toLowerCase()) ||
    supplier.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newSupplier: Supplier = {
      id: Date.now(),
      name: form.name.trim(),
      country: form.country.trim(),
      contact: form.contact.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      active: true,
    };

    setSuppliers(previous => [...previous, newSupplier]);

    setForm({
      name: '',
      country: '',
      contact: '',
      email: '',
      phone: '',
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
                Logística / Proveedores
              </p>

              <h1 className="text-3xl font-bold">
                Proveedores
              </h1>

              <p className="mt-1 text-sm text-gray-400">
                Administración de empresas proveedoras.
              </p>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="rounded-lg bg-[#d9a441] px-5 py-3 text-sm font-semibold text-[#202521] transition-colors hover:bg-[#e8b653]"
            >
              + Agregar proveedor
            </button>
          </div>

          {/* INDICADORES */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

            <div className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">
              <p className="text-sm text-gray-400">
                Total de proveedores
              </p>
              <p className="mt-2 text-2xl font-bold">
                {suppliers.length}
              </p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">
              <p className="text-sm text-gray-400">
                Proveedores activos
              </p>
              <p className="mt-2 text-2xl font-bold text-green-400">
                {suppliers.filter(supplier => supplier.active).length}
              </p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">
              <p className="text-sm text-gray-400">
                Proveedores inactivos
              </p>
              <p className="mt-2 text-2xl font-bold text-red-400">
                {suppliers.filter(supplier => !supplier.active).length}
              </p>
            </div>

          </div>

          {/* TABLA */}
          <section className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">

            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-lg font-semibold">
                Directorio de proveedores
              </h2>

              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar proveedor, país o contacto..."
                className="w-full rounded-lg border border-gray-700 bg-[#202521] px-4 py-2.5 text-sm text-white outline-none focus:border-[#d9a441] sm:w-80"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left text-sm">

                <thead>
                  <tr className="border-b border-gray-700 text-xs uppercase text-gray-400">
                    <th className="px-4 py-4">Empresa</th>
                    <th className="px-4 py-4">País</th>
                    <th className="px-4 py-4">Contacto</th>
                    <th className="px-4 py-4">Correo</th>
                    <th className="px-4 py-4">Teléfono</th>
                    <th className="px-4 py-4">Estado</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredSuppliers.map(supplier => (
                    <tr
                      key={supplier.id}
                      className="border-b border-gray-800 transition-colors hover:bg-white/5"
                    >
                      <td className="px-4 py-4 font-medium">
                        {supplier.name}
                      </td>

                      <td className="px-4 py-4 text-gray-300">
                        {supplier.country}
                      </td>

                      <td className="px-4 py-4 text-gray-300">
                        {supplier.contact}
                      </td>

                      <td className="px-4 py-4 text-gray-300">
                        {supplier.email}
                      </td>

                      <td className="px-4 py-4 text-gray-300">
                        {supplier.phone}
                      </td>

                      <td className="px-4 py-4">
                        {supplier.active ? (
                          <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                            Activo
                          </span>
                        ) : (
                          <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
                            Inactivo
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>

              {filteredSuppliers.length === 0 && (
                <p className="py-10 text-center text-sm text-gray-400">
                  No se encontraron proveedores.
                </p>
              )}
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Mostrando {filteredSuppliers.length} de {suppliers.length} proveedores
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
                  Nuevo proveedor
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  Registra la información de la empresa.
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
                  Nombre de la empresa
                </label>

                <input
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Ej. Distribuidora Modelo"
                  className="w-full rounded-lg border border-gray-700 bg-[#202521] px-3 py-2.5 text-sm outline-none focus:border-[#d9a441]"
                />
              </div>

              <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    País de origen
                  </label>

                  <input
                    required
                    value={form.country}
                    onChange={e => setForm({ ...form, country: e.target.value })}
                    placeholder="Ej. México"
                    className="w-full rounded-lg border border-gray-700 bg-[#202521] px-3 py-2.5 text-sm outline-none focus:border-[#d9a441]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Persona de contacto
                  </label>

                  <input
                    required
                    value={form.contact}
                    onChange={e => setForm({ ...form, contact: e.target.value })}
                    placeholder="Nombre del contacto"
                    className="w-full rounded-lg border border-gray-700 bg-[#202521] px-3 py-2.5 text-sm outline-none focus:border-[#d9a441]"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm text-gray-300">
                  Correo electrónico
                </label>

                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="correo@empresa.com"
                  className="w-full rounded-lg border border-gray-700 bg-[#202521] px-3 py-2.5 text-sm outline-none focus:border-[#d9a441]"
                />
              </div>

              <div className="mb-6">
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
                  Guardar proveedor
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
