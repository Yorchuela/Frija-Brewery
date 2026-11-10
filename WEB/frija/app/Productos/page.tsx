'use client';

import { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';

type Product = {
  id: number;
  sku: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
};

const initialProducts: Product[] = [
  {
    id: 1,
    sku: 'FRJ-001',
    name: 'Cerveza Lager',
    brand: 'Frija',
    category: 'Lager',
    price: 35,
    stock: 120,
  },
  {
    id: 2,
    sku: 'FRJ-002',
    name: 'Cerveza IPA',
    brand: 'Frija',
    category: 'IPA',
    price: 48,
    stock: 75,
  },
  {
    id: 3,
    sku: 'IMP-001',
    name: 'Heineken Original',
    brand: 'Heineken',
    category: 'Lager',
    price: 42,
    stock: 90,
  },
  {
    id: 4,
    sku: 'IMP-002',
    name: 'Guinness Draught',
    brand: 'Guinness',
    category: 'Stout',
    price: 65,
    stock: 0,
  },
];

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    sku: '',
    name: '',
    brand: '',
    category: '',
    price: '',
    stock: '',
  });

  const filteredProducts = products.filter((product) => {
    const searchText = search.toLowerCase();

    return (
      product.name.toLowerCase().includes(searchText) ||
      product.sku.toLowerCase().includes(searchText) ||
      product.brand.toLowerCase().includes(searchText) ||
      product.category.toLowerCase().includes(searchText)
    );
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newProduct: Product = {
      id: Date.now(),
      sku: form.sku.trim(),
      name: form.name.trim(),
      brand: form.brand.trim(),
      category: form.category.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
    };

    setProducts((previous) => [...previous, newProduct]);

    setForm({
      sku: '',
      name: '',
      brand: '',
      category: '',
      price: '',
      stock: '',
    });

    setShowForm(false);
  };

  const formatPrice = (price: number) =>
    price.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
    });

  return (
    <div className="flex min-h-screen bg-[#202521] font-sans text-white">

      {/* MENU LATERAL */}
      <div className="hidden shrink-0 md:block">
        <Sidebar />
      </div>

      {/* CONTENIDO */}
      <main className="min-w-0 flex-1 p-5 lg:p-8">
        <div className="mx-auto max-w-7xl">

          {/* ENCABEZADO */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="mb-2 text-sm text-gray-400">
                Catálogo / Productos
              </p>
              <h1 className="text-3xl font-bold">
                Productos
              </h1>
              <p className="mt-1 text-sm text-gray-400">
                Administración del catálogo de productos.
              </p>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="rounded-lg bg-[#d9a441] px-5 py-3 text-sm font-semibold text-[#202521] transition-colors hover:bg-[#e8b653]"
            >
              + Agregar producto
            </button>
          </div>

          {/* INDICADORES */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">
              <p className="text-sm text-gray-400">
                Total de productos
              </p>
              <p className="mt-2 text-2xl font-bold">
                {products.length}
              </p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">
              <p className="text-sm text-gray-400">
                Productos disponibles
              </p>
              <p className="mt-2 text-2xl font-bold text-green-400">
                {products.filter((product) => product.stock > 0).length}
              </p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">
              <p className="text-sm text-gray-400">
                Sin existencias
              </p>
              <p className="mt-2 text-2xl font-bold text-red-400">
                {products.filter((product) => product.stock === 0).length}
              </p>
            </div>
          </div>

          {/* TABLA DE PRODUCTOS */}
          <section className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">

            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-lg font-semibold">
                Listado de productos
              </h2>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
                    <th className="px-4 py-4">Categoría</th>
                    <th className="px-4 py-4">Precio</th>
                    <th className="px-4 py-4">Stock</th>
                    <th className="px-4 py-4">Estado</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-gray-800 transition-colors hover:bg-white/5"
                    >
                      <td className="px-4 py-4 text-gray-400">
                        {product.sku}
                      </td>
                      <td className="px-4 py-4 font-medium">
                        {product.name}
                      </td>
                      <td className="px-4 py-4 text-gray-300">
                        {product.brand}
                      </td>
                      <td className="px-4 py-4 text-gray-300">
                        {product.category}
                      </td>
                      <td className="px-4 py-4">
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-4 py-4">
                        {product.stock}
                      </td>
                      <td className="px-4 py-4">
                        {product.stock > 0 ? (
                          <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                            Disponible
                          </span>
                        ) : (
                          <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
                            Sin stock
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredProducts.length === 0 && (
                <p className="py-10 text-center text-sm text-gray-400">
                  No se encontraron productos.
                </p>
              )}
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Mostrando {filteredProducts.length} de {products.length} productos
            </p>
          </section>
        </div>
      </main>

      {/* FORMULARIO PARA AGREGAR PRODUCTOS */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4">
          <div className="my-auto w-full max-w-xl rounded-xl border border-gray-700 bg-[#2a302b] p-6">

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  Nuevo producto
                </h2>
                <p className="mt-1 text-sm text-gray-400">
                  Completa la información del producto.
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    SKU
                  </label>
                  <input
                    required
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    placeholder="Ej. FRJ-005"
                    className="w-full rounded-lg border border-gray-700 bg-[#202521] px-3 py-2.5 text-sm outline-none focus:border-[#d9a441]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Nombre
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Nombre del producto"
                    className="w-full rounded-lg border border-gray-700 bg-[#202521] px-3 py-2.5 text-sm outline-none focus:border-[#d9a441]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Marca
                  </label>
                  <input
                    required
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    placeholder="Marca"
                    className="w-full rounded-lg border border-gray-700 bg-[#202521] px-3 py-2.5 text-sm outline-none focus:border-[#d9a441]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Categoría
                  </label>
                  <input
                    required
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="Ej. Lager"
                    className="w-full rounded-lg border border-gray-700 bg-[#202521] px-3 py-2.5 text-sm outline-none focus:border-[#d9a441]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Precio (MXN)
                  </label>
                  <input
                    required
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="0.00"
                    className="w-full rounded-lg border border-gray-700 bg-[#202521] px-3 py-2.5 text-sm outline-none focus:border-[#d9a441]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Existencias
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="1"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    placeholder="0"
                    className="w-full rounded-lg border border-gray-700 bg-[#202521] px-3 py-2.5 text-sm outline-none focus:border-[#d9a441]"
                  />
                </div>
              </div>

              <div className="mt-7 flex justify-end gap-3">
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
                  Guardar producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
