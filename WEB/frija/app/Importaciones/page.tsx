'use client';

import { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';

type Importation = {
  id: number;
  code: string;
  supplier: string;
  date: string;
  quantity: number;
  total: number;
  status: 'Pendiente' | 'En tránsito' | 'Recibida';
};

const initialImports: Importation[] = [
  { id: 1, code: 'IMP-2026-001', supplier: 'Heineken México', date: '2026-11-05', quantity: 120, total: 5040, status: 'Recibida' },
  { id: 2, code: 'IMP-2026-002', supplier: 'Distribuidora Modelo', date: '2026-11-07', quantity: 200, total: 7200, status: 'En tránsito' },
  { id: 3, code: 'IMP-2026-003', supplier: 'Importadora Guinness', date: '2026-11-09', quantity: 80, total: 5200, status: 'Pendiente' },
];

export default function ImportacionesPage() {
  const [imports, setImports] = useState<Importation[]>(initialImports);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    supplier: '',
    date: '',
    quantity: '',
    total: '',
    status: 'Pendiente' as Importation['status'],
  });

  const filteredImports = imports.filter(item =>
    item.code.toLowerCase().includes(search.toLowerCase()) ||
    item.supplier.toLowerCase().includes(search.toLowerCase()) ||
    item.status.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newImport: Importation = {
      id: Date.now(),
      code: `IMP-2026-${String(imports.length + 1).padStart(3, '0')}`,
      supplier: form.supplier.trim(),
      date: form.date,
      quantity: Number(form.quantity),
      total: Number(form.total),
      status: form.status,
    };

    setImports(previous => [...previous, newImport]);

    setForm({
      supplier: '',
      date: '',
      quantity: '',
      total: '',
      status: 'Pendiente',
    });

    setShowForm(false);
  };

  const formatCurrency = (amount: number) =>
    amount.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
    });

  const statusStyle = (status: Importation['status']) => {
    if (status === 'Recibida') {
      return 'bg-green-500/10 text-green-400';
    }

    if (status === 'En tránsito') {
      return 'bg-blue-500/10 text-blue-400';
    }

    return 'bg-yellow-500/10 text-yellow-400';
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
                Operaciones / Importaciones
              </p>

              <h1 className="text-3xl font-bold">
                Importaciones
              </h1>

              <p className="mt-1 text-sm text-gray-400">
                Control y seguimiento de mercancía importada.
              </p>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="rounded-lg bg-[#d9a441] px-5 py-3 text-sm font-semibold text-[#202521] transition-colors hover:bg-[#e8b653]"
            >
              + Nueva importación
            </button>
          </div>

          {/* INDICADORES */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">
              <p className="text-sm text-gray-400">Total de importaciones</p>
              <p className="mt-2 text-2xl font-bold">{imports.length}</p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">
              <p className="text-sm text-gray-400">Pendientes</p>
              <p className="mt-2 text-2xl font-bold text-yellow-400">
                {imports.filter(item => item.status === 'Pendiente').length}
              </p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">
              <p className="text-sm text-gray-400">En tránsito</p>
              <p className="mt-2 text-2xl font-bold text-blue-400">
                {imports.filter(item => item.status === 'En tránsito').length}
              </p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">
              <p className="text-sm text-gray-400">Recibidas</p>
              <p className="mt-2 text-2xl font-bold text-green-400">
                {imports.filter(item => item.status === 'Recibida').length}
              </p>
            </div>

          </div>

          {/* TABLA */}
          <section className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">

            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-lg font-semibold">
                Historial de importaciones
              </h2>

              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar código, proveedor o estado..."
                className="w-full rounded-lg border border-gray-700 bg-[#202521] px-4 py-2.5 text-sm text-white outline-none focus:border-[#d9a441] sm:w-80"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">

                <thead>
                  <tr className="border-b border-gray-700 text-xs uppercase text-gray-400">
                    <th className="px-4 py-4">Código</th>
                    <th className="px-4 py-4">Proveedor</th>
                    <th className="px-4 py-4">Fecha</th>
                    <th className="px-4 py-4">Cantidad</th>
                    <th className="px-4 py-4">Total</th>
                    <th className="px-4 py-4">Estado</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredImports.map(item => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-800 transition-colors hover:bg-white/5"
                    >
                      <td className="px-4 py-4 font-medium text-[#d9a441]">
                        {item.code}
                      </td>

                      <td className="px-4 py-4">
                        {item.supplier}
                      </td>

                      <td className="px-4 py-4 text-gray-300">
                        {item.date}
                      </td>

                      <td className="px-4 py-4">
                        {item.quantity}
                      </td>

                      <td className="px-4 py-4">
                        {formatCurrency(item.total)}
                      </td>

                      <td className="px-4 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>

              {filteredImports.length === 0 && (
                <p className="py-10 text-center text-sm text-gray-400">
                  No se encontraron importaciones.
                </p>
              )}
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Mostrando {filteredImports.length} de {imports.length} importaciones
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
                  Nueva importación
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  Registra una nueva operación de importación.
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
                  Proveedor
                </label>

                <input
                  required
                  value={form.supplier}
                  onChange={e => setForm({ ...form, supplier: e.target.value })}
                  placeholder="Nombre del proveedor"
                  className="w-full rounded-lg border border-gray-700 bg-[#202521] px-3 py-2.5 text-sm outline-none focus:border-[#d9a441]"
                />
              </div>

              <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Fecha
                  </label>

                  <input
                    required
                    type="date"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    className="w-full rounded-lg border border-gray-700 bg-[#202521] px-3 py-2.5 text-sm outline-none focus:border-[#d9a441]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Cantidad de unidades
                  </label>

                  <input
                    required
                    type="number"
                    min="1"
                    value={form.quantity}
                    onChange={e => setForm({ ...form, quantity: e.target.value })}
                    placeholder="Ej. 100"
                    className="w-full rounded-lg border border-gray-700 bg-[#202521] px-3 py-2.5 text-sm outline-none focus:border-[#d9a441]"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm text-gray-300">
                  Importe total (MXN)
                </label>

                <input
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.total}
                  onChange={e => setForm({ ...form, total: e.target.value })}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-gray-700 bg-[#202521] px-3 py-2.5 text-sm outline-none focus:border-[#d9a441]"
                />
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm text-gray-300">
                  Estado
                </label>

                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value as Importation['status'] })}
                  className="w-full rounded-lg border border-gray-700 bg-[#202521] px-3 py-2.5 text-sm outline-none focus:border-[#d9a441]"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="En tránsito">En tránsito</option>
                  <option value="Recibida">Recibida</option>
                </select>
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
                  Guardar importación
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
