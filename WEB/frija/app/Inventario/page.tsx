'use client';

import { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';

type InventoryItem = {
  id: number;
  sku: string;
  name: string;
  brand: string;
  stock: number;
  minimum: number;
};

const initialInventory: InventoryItem[] = [
  { id: 1, sku: 'FRJ-001', name: 'Cerveza Lager', brand: 'Frija', stock: 120, minimum: 30 },
  { id: 2, sku: 'FRJ-002', name: 'Cerveza IPA', brand: 'Frija', stock: 75, minimum: 25 },
  { id: 3, sku: 'IMP-001', name: 'Heineken Original', brand: 'Heineken', stock: 90, minimum: 20 },
  { id: 4, sku: 'IMP-002', name: 'Guinness Draught', brand: 'Guinness', stock: 0, minimum: 15 },
];

export default function InventarioPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [movementType, setMovementType] = useState<'entrada' | 'salida'>('entrada');
  const [quantity, setQuantity] = useState('');

  const totalUnits = inventory.reduce((sum, item) => sum + item.stock, 0);
  const lowStock = inventory.filter(item => item.stock > 0 && item.stock <= item.minimum).length;
  const outOfStock = inventory.filter(item => item.stock === 0).length;

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.sku.toLowerCase().includes(search.toLowerCase()) ||
    item.brand.toLowerCase().includes(search.toLowerCase())
  );

  const handleMovement = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const amount = Number(quantity);
    const productId = Number(selectedProduct);

    if (!amount || amount <= 0) {
      alert('Ingresa una cantidad válida.');
      return;
    }

    const product = inventory.find(item => item.id === productId);

    if (!product) return;

    if (movementType === 'salida' && amount > product.stock) {
      alert('No hay suficientes existencias para realizar esta salida.');
      return;
    }

    setInventory(previous =>
      previous.map(item => {
        if (item.id !== productId) return item;

        return {
          ...item,
          stock: movementType === 'entrada'
            ? item.stock + amount
            : item.stock - amount,
        };
      })
    );

    setQuantity('');
    setSelectedProduct('');
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
                Operaciones / Inventario
              </p>

              <h1 className="text-3xl font-bold">
                Inventario
              </h1>

              <p className="mt-1 text-sm text-gray-400">
                Control de existencias y movimientos de productos.
              </p>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="rounded-lg bg-[#d9a441] px-5 py-3 text-sm font-semibold text-[#202521] transition-colors hover:bg-[#e8b653]"
            >
              + Registrar movimiento
            </button>
          </div>

          {/* INDICADORES */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">
              <p className="text-sm text-gray-400">Productos registrados</p>
              <p className="mt-2 text-2xl font-bold">{inventory.length}</p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">
              <p className="text-sm text-gray-400">Unidades disponibles</p>
              <p className="mt-2 text-2xl font-bold text-green-400">{totalUnits}</p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">
              <p className="text-sm text-gray-400">Stock bajo</p>
              <p className="mt-2 text-2xl font-bold text-yellow-400">{lowStock}</p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">
              <p className="text-sm text-gray-400">Agotados</p>
              <p className="mt-2 text-2xl font-bold text-red-400">{outOfStock}</p>
            </div>

          </div>

          {/* TABLA DE INVENTARIO */}
          <section className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">

            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-lg font-semibold">
                Existencias de productos
              </h2>

              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar producto, SKU o marca..."
                className="w-full rounded-lg border border-gray-700 bg-[#202521] px-4 py-2.5 text-sm text-white outline-none focus:border-[#d9a441] sm:w-80"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left text-sm">

                <thead>
                  <tr className="border-b border-gray-700 text-xs uppercase text-gray-400">
                    <th className="px-4 py-4">SKU</th>
                    <th className="px-4 py-4">Producto</th>
                    <th className="px-4 py-4">Marca</th>
                    <th className="px-4 py-4">Existencias</th>
                    <th className="px-4 py-4">Stock mínimo</th>
                    <th className="px-4 py-4">Estado</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredInventory.map(item => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-800 transition-colors hover:bg-white/5"
                    >
                      <td className="px-4 py-4 text-gray-400">{item.sku}</td>
                      <td className="px-4 py-4 font-medium">{item.name}</td>
                      <td className="px-4 py-4 text-gray-300">{item.brand}</td>
                      <td className="px-4 py-4 font-semibold">{item.stock}</td>
                      <td className="px-4 py-4 text-gray-300">{item.minimum}</td>
                      <td className="px-4 py-4">
                        {item.stock === 0 ? (
                          <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs text-red-400">
                            Agotado
                          </span>
                        ) : item.stock <= item.minimum ? (
                          <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs text-yellow-400">
                            Stock bajo
                          </span>
                        ) : (
                          <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-400">
                            Disponible
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>

              {filteredInventory.length === 0 && (
                <p className="py-10 text-center text-sm text-gray-400">
                  No se encontraron productos.
                </p>
              )}
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Mostrando {filteredInventory.length} de {inventory.length} productos
            </p>

          </section>
        </div>
      </main>

      {/* FORMULARIO DE MOVIMIENTOS */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4">

          <div className="my-auto w-full max-w-lg rounded-xl border border-gray-700 bg-[#2a302b] p-6">

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Registrar movimiento</h2>
                <p className="mt-1 text-sm text-gray-400">
                  Registra una entrada o salida de mercancía.
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

            <form onSubmit={handleMovement}>

              <div className="mb-4">
                <label className="mb-2 block text-sm text-gray-300">
                  Producto
                </label>

                <select
                  required
                  value={selectedProduct}
                  onChange={e => setSelectedProduct(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-[#202521] px-3 py-2.5 text-sm outline-none focus:border-[#d9a441]"
                >
                  <option value="">Selecciona un producto</option>
                  {inventory.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.sku} - {item.name} ({item.stock} disponibles)
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm text-gray-300">
                  Tipo de movimiento
                </label>

                <select
                  value={movementType}
                  onChange={e => setMovementType(e.target.value as 'entrada' | 'salida')}
                  className="w-full rounded-lg border border-gray-700 bg-[#202521] px-3 py-2.5 text-sm outline-none focus:border-[#d9a441]"
                >
                  <option value="entrada">Entrada de mercancía</option>
                  <option value="salida">Salida de mercancía</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm text-gray-300">
                  Cantidad
                </label>

                <input
                  required
                  type="number"
                  min="1"
                  step="1"
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  placeholder="Ingresa la cantidad"
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
                  Guardar movimiento
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
