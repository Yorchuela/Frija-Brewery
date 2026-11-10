'use client';

import { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';

type Shipment = {
  id: number;
  code: string;
  destination: string;
  responsible: string;
  date: string;
  estimatedDate: string;
  status: 'En preparación' | 'En tránsito' | 'Entregado';
};

const initialShipments: Shipment[] = [
  {
    id: 1,
    code: 'ENV-2026-001',
    destination: 'Sucursal Tijuana',
    responsible: 'Carlos Martínez',
    date: '2026-11-05',
    estimatedDate: '2026-11-06',
    status: 'Entregado',
  },
  {
    id: 2,
    code: 'ENV-2026-002',
    destination: 'Sucursal Mexicali',
    responsible: 'Ana Rodríguez',
    date: '2026-11-08',
    estimatedDate: '2026-11-11',
    status: 'En tránsito',
  },
  {
    id: 3,
    code: 'ENV-2026-003',
    destination: 'Sucursal Ensenada',
    responsible: 'Luis Hernández',
    date: '2026-11-10',
    estimatedDate: '2026-11-12',
    status: 'En preparación',
  },
];

export default function EnviosPage() {
  const [shipments, setShipments] = useState<Shipment[]>(initialShipments);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    destination: '',
    responsible: '',
    date: '',
    estimatedDate: '',
    status: 'En preparación' as Shipment['status'],
  });

  const filteredShipments = shipments.filter(shipment =>
    shipment.code.toLowerCase().includes(search.toLowerCase()) ||
    shipment.destination.toLowerCase().includes(search.toLowerCase()) ||
    shipment.responsible.toLowerCase().includes(search.toLowerCase()) ||
    shipment.status.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newShipment: Shipment = {
      id: Date.now(),
      code: `ENV-2026-${String(shipments.length + 1).padStart(3, '0')}`,
      destination: form.destination.trim(),
      responsible: form.responsible.trim(),
      date: form.date,
      estimatedDate: form.estimatedDate,
      status: form.status,
    };

    setShipments(previous => [...previous, newShipment]);

    setForm({
      destination: '',
      responsible: '',
      date: '',
      estimatedDate: '',
      status: 'En preparación',
    });

    setShowForm(false);
  };

  const statusStyle = (status: Shipment['status']) => {
    if (status === 'Entregado') {
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
                Logística / Envíos
              </p>

              <h1 className="text-3xl font-bold">
                Envíos
              </h1>

              <p className="mt-1 text-sm text-gray-400">
                Seguimiento y control de distribución de mercancía.
              </p>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="rounded-lg bg-[#d9a441] px-5 py-3 text-sm font-semibold text-[#202521] transition-colors hover:bg-[#e8b653]"
            >
              + Registrar envío
            </button>
          </div>

          {/* INDICADORES */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">
              <p className="text-sm text-gray-400">Total de envíos</p>
              <p className="mt-2 text-2xl font-bold">{shipments.length}</p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">
              <p className="text-sm text-gray-400">En preparación</p>
              <p className="mt-2 text-2xl font-bold text-yellow-400">
                {shipments.filter(item => item.status === 'En preparación').length}
              </p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">
              <p className="text-sm text-gray-400">En tránsito</p>
              <p className="mt-2 text-2xl font-bold text-blue-400">
                {shipments.filter(item => item.status === 'En tránsito').length}
              </p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">
              <p className="text-sm text-gray-400">Entregados</p>
              <p className="mt-2 text-2xl font-bold text-green-400">
                {shipments.filter(item => item.status === 'Entregado').length}
              </p>
            </div>

          </div>

          {/* TABLA */}
          <section className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">

            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-lg font-semibold">
                Historial de envíos
              </h2>

              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar folio, destino o responsable..."
                className="w-full rounded-lg border border-gray-700 bg-[#202521] px-4 py-2.5 text-sm text-white outline-none focus:border-[#d9a441] sm:w-80"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left text-sm">

                <thead>
                  <tr className="border-b border-gray-700 text-xs uppercase text-gray-400">
                    <th className="px-4 py-4">Folio</th>
                    <th className="px-4 py-4">Destino</th>
                    <th className="px-4 py-4">Responsable</th>
                    <th className="px-4 py-4">Fecha de envío</th>
                    <th className="px-4 py-4">Entrega estimada</th>
                    <th className="px-4 py-4">Estado</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredShipments.map(shipment => (
                    <tr
                      key={shipment.id}
                      className="border-b border-gray-800 transition-colors hover:bg-white/5"
                    >
                      <td className="px-4 py-4 font-medium text-[#d9a441]">
                        {shipment.code}
                      </td>

                      <td className="px-4 py-4">
                        {shipment.destination}
                      </td>

                      <td className="px-4 py-4 text-gray-300">
                        {shipment.responsible}
                      </td>

                      <td className="px-4 py-4 text-gray-300">
                        {shipment.date}
                      </td>

                      <td className="px-4 py-4 text-gray-300">
                        {shipment.estimatedDate}
                      </td>

                      <td className="px-4 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle(shipment.status)}`}>
                          {shipment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>

              {filteredShipments.length === 0 && (
                <p className="py-10 text-center text-sm text-gray-400">
                  No se encontraron envíos.
                </p>
              )}
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Mostrando {filteredShipments.length} de {shipments.length} envíos
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
                <h2 className="text-xl font-bold">Nuevo envío</h2>
                <p className="mt-1 text-sm text-gray-400">
                  Registra un nuevo envío de mercancía.
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
                  Destino
                </label>

                <input
                  required
                  value={form.destination}
                  onChange={e => setForm({ ...form, destination: e.target.value })}
                  placeholder="Ej. Sucursal Tijuana"
                  className="w-full rounded-lg border border-gray-700 bg-[#202521] px-3 py-2.5 text-sm outline-none focus:border-[#d9a441]"
                />
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm text-gray-300">
                  Responsable de recepción
                </label>

                <input
                  required
                  value={form.responsible}
                  onChange={e => setForm({ ...form, responsible: e.target.value })}
                  placeholder="Nombre del responsable"
                  className="w-full rounded-lg border border-gray-700 bg-[#202521] px-3 py-2.5 text-sm outline-none focus:border-[#d9a441]"
                />
              </div>

              <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Fecha de envío
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
                    Entrega estimada
                  </label>

                  <input
                    required
                    type="date"
                    min={form.date || undefined}
                    value={form.estimatedDate}
                    onChange={e => setForm({ ...form, estimatedDate: e.target.value })}
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
                  onChange={e => setForm({ ...form, status: e.target.value as Shipment['status'] })}
                  className="w-full rounded-lg border border-gray-700 bg-[#202521] px-3 py-2.5 text-sm outline-none focus:border-[#d9a441]"
                >
                  <option value="En preparación">En preparación</option>
                  <option value="En tránsito">En tránsito</option>
                  <option value="Entregado">Entregado</option>
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
                  Guardar envío
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
