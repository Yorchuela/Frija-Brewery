'use client';

import { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';

type Sale = {
  id: number;
  code: string;
  customer: string;
  branch: string;
  date: string;
  total: number;
  status: 'Completada' | 'Pendiente' | 'Cancelada';
};

const initialSales: Sale[] = [
  { id: 1, code: 'VTA-2026-001', customer: 'Restaurante El Puerto', branch: 'Tijuana', date: '2026-11-05', total: 3500, status: 'Completada' },
  { id: 2, code: 'VTA-2026-002', customer: 'Bar La Estación', branch: 'Mexicali', date: '2026-11-07', total: 5200, status: 'Pendiente' },
  { id: 3, code: 'VTA-2026-003', customer: 'Cervecería Central', branch: 'Tijuana', date: '2026-11-09', total: 2800, status: 'Completada' },
  { id: 4, code: 'VTA-2026-004', customer: 'Restaurante La Terraza', branch: 'Ensenada', date: '2026-11-10', total: 4100, status: 'Cancelada' },
];

export default function VentasPage() {
  const [sales, setSales] = useState<Sale[]>(initialSales);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    customer: '',
    branch: '',
    date: '',
    total: '',
    status: 'Pendiente' as Sale['status'],
  });

  const filteredSales = sales.filter(sale =>
    sale.code.toLowerCase().includes(search.toLowerCase()) ||
    sale.customer.toLowerCase().includes(search.toLowerCase()) ||
    sale.branch.toLowerCase().includes(search.toLowerCase()) ||
    sale.status.toLowerCase().includes(search.toLowerCase())
  );

  const completedSales = sales.filter(sale => sale.status === 'Completada');
  const totalIncome = completedSales.reduce((sum, sale) => sum + sale.total, 0);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newSale: Sale = {
      id: Date.now(),
      code: `VTA-2026-${String(sales.length + 1).padStart(3, '0')}`,
      customer: form.customer.trim(),
      branch: form.branch.trim(),
      date: form.date,
      total: Number(form.total),
      status: form.status,
    };

    setSales(previous => [...previous, newSale]);

    setForm({
      customer: '',
      branch: '',
      date: '',
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

  const statusStyle = (status: Sale['status']) => {
    if (status === 'Completada') return 'bg-green-500/10 text-green-400';
    if (status === 'Cancelada') return 'bg-red-500/10 text-red-400';
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
                Operaciones / Ventas
              </p>

              <h1 className="text-3xl font-bold">
                Ventas
              </h1>

              <p className="mt-1 text-sm text-gray-400">
                Registro y seguimiento de ventas realizadas.
              </p>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="rounded-lg bg-[#d9a441] px-5 py-3 text-sm font-semibold text-[#202521] transition-colors hover:bg-[#e8b653]"
            >
              + Registrar venta
            </button>
          </div>

          {/* INDICADORES */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">
              <p className="text-sm text-gray-400">Total de ventas</p>
              <p className="mt-2 text-2xl font-bold">{sales.length}</p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">
              <p className="text-sm text-gray-400">Ingresos completados</p>
              <p className="mt-2 text-2xl font-bold text-green-400">
                {formatCurrency(totalIncome)}
              </p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">
              <p className="text-sm text-gray-400">Pendientes</p>
              <p className="mt-2 text-2xl font-bold text-yellow-400">
                {sales.filter(sale => sale.status === 'Pendiente').length}
              </p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">
              <p className="text-sm text-gray-400">Completadas</p>
              <p className="mt-2 text-2xl font-bold text-green-400">
                {completedSales.length}
              </p>
            </div>

          </div>

          {/* TABLA */}
          <section className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">

            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-lg font-semibold">
                Historial de ventas
              </h2>

              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar folio, cliente o sucursal..."
                className="w-full rounded-lg border border-gray-700 bg-[#202521] px-4 py-2.5 text-sm text-white outline-none focus:border-[#d9a441] sm:w-80"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">

                <thead>
                  <tr className="border-b border-gray-700 text-xs uppercase text-gray-400">
                    <th className="px-4 py-4">Folio</th>
                    <th className="px-4 py-4">Cliente</th>
                    <th className="px-4 py-4">Sucursal</th>
                    <th className="px-4 py-4">Fecha</th>
                    <th className="px-4 py-4">Importe</th>
                    <th className="px-4 py-4">Estado</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredSales.map(sale => (
                    <tr
                      key={sale.id}
                      className="border-b border-gray-800 transition-colors hover:bg-white/5"
                    >
                      <td className="px-4 py-4 font-medium text-[#d9a441]">
                        {sale.code}
                      </td>

                      <td className="px-4 py-4">
                        {sale.customer}
                      </td>

                      <td className="px-4 py-4 text-gray-300">
                        {sale.branch}
                      </td>

                      <td className="px-4 py-4 text-gray-300">
                        {sale.date}
                      </td>

                      <td className="px-4 py-4">
                        {formatCurrency(sale.total)}
                      </td>

                      <td className="px-4 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle(sale.status)}`}>
                          {sale.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>

              {filteredSales.length === 0 && (
                <p className="py-10 text-center text-sm text-gray-400">
                  No se encontraron ventas.
                </p>
              )}
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Mostrando {filteredSales.length} de {sales.length} ventas
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
                <h2 className="text-xl font-bold">Nueva venta</h2>
                <p className="mt-1 text-sm text-gray-400">
                  Registra una nueva venta.
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
                  Cliente
                </label>

                <input
                  required
                  value={form.customer}
                  onChange={e => setForm({ ...form, customer: e.target.value })}
                  placeholder="Nombre del cliente"
                  className="w-full rounded-lg border border-gray-700 bg-[#202521] px-3 py-2.5 text-sm outline-none focus:border-[#d9a441]"
                />
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm text-gray-300">
                  Sucursal
                </label>

                <input
                  required
                  value={form.branch}
                  onChange={e => setForm({ ...form, branch: e.target.value })}
                  placeholder="Ej. Tijuana"
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
                    Importe (MXN)
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
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm text-gray-300">
                  Estado
                </label>

                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value as Sale['status'] })}
                  className="w-full rounded-lg border border-gray-700 bg-[#202521] px-3 py-2.5 text-sm outline-none focus:border-[#d9a441]"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Completada">Completada</option>
                  <option value="Cancelada">Cancelada</option>
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
                  Guardar venta
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
