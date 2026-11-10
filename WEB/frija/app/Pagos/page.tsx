'use client';

import { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';

type Payment = {
  id: number;
  code: string;
  concept: string;
  person: string;
  date: string;
  method: string;
  amount: number;
  status: 'Completado' | 'Pendiente' | 'Cancelado';
};

const initialPayments: Payment[] = [
  { id: 1, code: 'PAG-2026-001', concept: 'Venta VTA-2026-001', person: 'Restaurante El Puerto', date: '2026-11-05', method: 'Transferencia', amount: 3500, status: 'Completado' },
  { id: 2, code: 'PAG-2026-002', concept: 'Importación IMP-2026-001', person: 'Heineken México', date: '2026-11-06', method: 'Transferencia', amount: 5040, status: 'Pendiente' },
  { id: 3, code: 'PAG-2026-003', concept: 'Venta VTA-2026-003', person: 'Cervecería Central', date: '2026-11-09', method: 'Efectivo', amount: 2800, status: 'Completado' },
];

export default function PagosPage() {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    concept: '',
    person: '',
    date: '',
    method: 'Transferencia',
    amount: '',
    status: 'Pendiente' as Payment['status'],
  });

  const filteredPayments = payments.filter(payment =>
    payment.code.toLowerCase().includes(search.toLowerCase()) ||
    payment.concept.toLowerCase().includes(search.toLowerCase()) ||
    payment.person.toLowerCase().includes(search.toLowerCase()) ||
    payment.status.toLowerCase().includes(search.toLowerCase())
  );

  const completedPayments = payments.filter(
    payment => payment.status === 'Completado'
  );

  const totalPaid = completedPayments.reduce(
    (sum, payment) => sum + payment.amount, 0
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newPayment: Payment = {
      id: Date.now(),
      code: `PAG-2026-${String(payments.length + 1).padStart(3, '0')}`,
      concept: form.concept.trim(),
      person: form.person.trim(),
      date: form.date,
      method: form.method,
      amount: Number(form.amount),
      status: form.status,
    };

    setPayments(previous => [...previous, newPayment]);

    setForm({
      concept: '',
      person: '',
      date: '',
      method: 'Transferencia',
      amount: '',
      status: 'Pendiente',
    });

    setShowForm(false);
  };

  const formatCurrency = (amount: number) =>
    amount.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
    });

  const statusStyle = (status: Payment['status']) => {
    if (status === 'Completado') return 'bg-green-500/10 text-green-400';
    if (status === 'Cancelado') return 'bg-red-500/10 text-red-400';
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
                Operaciones / Pagos
              </p>

              <h1 className="text-3xl font-bold">Pagos</h1>

              <p className="mt-1 text-sm text-gray-400">
                Administración y seguimiento de pagos.
              </p>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="rounded-lg bg-[#d9a441] px-5 py-3 text-sm font-semibold text-[#202521] transition-colors hover:bg-[#e8b653]"
            >
              + Registrar pago
            </button>
          </div>

          {/* INDICADORES */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">
              <p className="text-sm text-gray-400">Total de pagos</p>
              <p className="mt-2 text-2xl font-bold">{payments.length}</p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">
              <p className="text-sm text-gray-400">Importe pagado</p>
              <p className="mt-2 text-2xl font-bold text-green-400">
                {formatCurrency(totalPaid)}
              </p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">
              <p className="text-sm text-gray-400">Pendientes</p>
              <p className="mt-2 text-2xl font-bold text-yellow-400">
                {payments.filter(payment => payment.status === 'Pendiente').length}
              </p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">
              <p className="text-sm text-gray-400">Completados</p>
              <p className="mt-2 text-2xl font-bold text-green-400">
                {completedPayments.length}
              </p>
            </div>

          </div>

          {/* TABLA */}
          <section className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">

            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-lg font-semibold">
                Historial de pagos
              </h2>

              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar folio, concepto o persona..."
                className="w-full rounded-lg border border-gray-700 bg-[#202521] px-4 py-2.5 text-sm text-white outline-none focus:border-[#d9a441] sm:w-80"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left text-sm">

                <thead>
                  <tr className="border-b border-gray-700 text-xs uppercase text-gray-400">
                    <th className="px-4 py-4">Folio</th>
                    <th className="px-4 py-4">Concepto</th>
                    <th className="px-4 py-4">Cliente / Proveedor</th>
                    <th className="px-4 py-4">Fecha</th>
                    <th className="px-4 py-4">Método</th>
                    <th className="px-4 py-4">Importe</th>
                    <th className="px-4 py-4">Estado</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPayments.map(payment => (
                    <tr
                      key={payment.id}
                      className="border-b border-gray-800 transition-colors hover:bg-white/5"
                    >
                      <td className="px-4 py-4 font-medium text-[#d9a441]">
                        {payment.code}
                      </td>

                      <td className="px-4 py-4">
                        {payment.concept}
                      </td>

                      <td className="px-4 py-4 text-gray-300">
                        {payment.person}
                      </td>

                      <td className="px-4 py-4 text-gray-300">
                        {payment.date}
                      </td>

                      <td className="px-4 py-4">
                        {payment.method}
                      </td>

                      <td className="px-4 py-4">
                        {formatCurrency(payment.amount)}
                      </td>

                      <td className="px-4 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle(payment.status)}`}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>

              {filteredPayments.length === 0 && (
                <p className="py-10 text-center text-sm text-gray-400">
                  No se encontraron pagos.
                </p>
              )}
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Mostrando {filteredPayments.length} de {payments.length} pagos
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
                <h2 className="text-xl font-bold">Nuevo pago</h2>
                <p className="mt-1 text-sm text-gray-400">
                  Registra un pago realizado o pendiente.
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
                  Concepto
                </label>

                <input
                  required
                  value={form.concept}
                  onChange={e => setForm({ ...form, concept: e.target.value })}
                  placeholder="Ej. Venta VTA-2026-001"
                  className="w-full rounded-lg border border-gray-700 bg-[#202521] px-3 py-2.5 text-sm outline-none focus:border-[#d9a441]"
                />
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm text-gray-300">
                  Cliente o proveedor
                </label>

                <input
                  required
                  value={form.person}
                  onChange={e => setForm({ ...form, person: e.target.value })}
                  placeholder="Nombre"
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
                    value={form.amount}
                    onChange={e => setForm({ ...form, amount: e.target.value })}
                    placeholder="0.00"
                    className="w-full rounded-lg border border-gray-700 bg-[#202521] px-3 py-2.5 text-sm outline-none focus:border-[#d9a441]"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm text-gray-300">
                  Método de pago
                </label>

                <select
                  value={form.method}
                  onChange={e => setForm({ ...form, method: e.target.value })}
                  className="w-full rounded-lg border border-gray-700 bg-[#202521] px-3 py-2.5 text-sm outline-none focus:border-[#d9a441]"
                >
                  <option value="Transferencia">Transferencia</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Tarjeta">Tarjeta</option>
                  <option value="Depósito">Depósito</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm text-gray-300">
                  Estado
                </label>

                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value as Payment['status'] })}
                  className="w-full rounded-lg border border-gray-700 bg-[#202521] px-3 py-2.5 text-sm outline-none focus:border-[#d9a441]"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Completado">Completado</option>
                  <option value="Cancelado">Cancelado</option>
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
                  Guardar pago
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
