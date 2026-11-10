'use client';

import { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';

type User = {
  id: number;
  name: string;
  email: string;
  role: 'Administrador' | 'Vendedor' | 'Inventario';
  branch: string;
  active: boolean;
};

const initialUsers: User[] = [
  {
    id: 1,
    name: 'Carlos Martínez',
    email: 'carlos@frija.com',
    role: 'Administrador',
    branch: 'Tijuana',
    active: true,
  },
  {
    id: 2,
    name: 'Ana Rodríguez',
    email: 'ana@frija.com',
    role: 'Vendedor',
    branch: 'Mexicali',
    active: true,
  },
  {
    id: 3,
    name: 'Luis Hernández',
    email: 'luis@frija.com',
    role: 'Inventario',
    branch: 'Ensenada',
    active: true,
  },
  {
    id: 4,
    name: 'María González',
    email: 'maria@frija.com',
    role: 'Vendedor',
    branch: 'Tijuana',
    active: false,
  },
];

export default function UsuariosPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'Vendedor' as User['role'],
    branch: '',
  });

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.role.toLowerCase().includes(search.toLowerCase()) ||
    user.branch.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newUser: User = {
      id: Date.now(),
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      branch: form.branch.trim(),
      active: true,
    };

    setUsers(previous => [...previous, newUser]);

    setForm({
      name: '',
      email: '',
      role: 'Vendedor',
      branch: '',
    });

    setShowForm(false);
  };

  const roleStyle = (role: User['role']) => {
    if (role === 'Administrador') {
      return 'bg-purple-500/10 text-purple-400';
    }

    if (role === 'Inventario') {
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
                Administración / Usuarios
              </p>

              <h1 className="text-3xl font-bold">
                Usuarios
              </h1>

              <p className="mt-1 text-sm text-gray-400">
                Administración del personal con acceso al sistema.
              </p>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="rounded-lg bg-[#d9a441] px-5 py-3 text-sm font-semibold text-[#202521] transition-colors hover:bg-[#e8b653]"
            >
              + Agregar usuario
            </button>
          </div>

          {/* INDICADORES */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">
              <p className="text-sm text-gray-400">Total de usuarios</p>
              <p className="mt-2 text-2xl font-bold">{users.length}</p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">
              <p className="text-sm text-gray-400">Usuarios activos</p>
              <p className="mt-2 text-2xl font-bold text-green-400">
                {users.filter(user => user.active).length}
              </p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">
              <p className="text-sm text-gray-400">Administradores</p>
              <p className="mt-2 text-2xl font-bold text-purple-400">
                {users.filter(user => user.role === 'Administrador').length}
              </p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">
              <p className="text-sm text-gray-400">Vendedores</p>
              <p className="mt-2 text-2xl font-bold text-yellow-400">
                {users.filter(user => user.role === 'Vendedor').length}
              </p>
            </div>

          </div>

          {/* TABLA */}
          <section className="rounded-xl border border-gray-800 bg-[#2a302b] p-5">

            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-lg font-semibold">
                Directorio de usuarios
              </h2>

              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar nombre, correo, rol o sucursal..."
                className="w-full rounded-lg border border-gray-700 bg-[#202521] px-4 py-2.5 text-sm text-white outline-none focus:border-[#d9a441] sm:w-80"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">

                <thead>
                  <tr className="border-b border-gray-700 text-xs uppercase text-gray-400">
                    <th className="px-4 py-4">Usuario</th>
                    <th className="px-4 py-4">Correo</th>
                    <th className="px-4 py-4">Rol</th>
                    <th className="px-4 py-4">Sucursal</th>
                    <th className="px-4 py-4">Estado</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map(user => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-800 transition-colors hover:bg-white/5"
                    >
                      <td className="px-4 py-4 font-medium">
                        {user.name}
                      </td>

                      <td className="px-4 py-4 text-gray-300">
                        {user.email}
                      </td>

                      <td className="px-4 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${roleStyle(user.role)}`}>
                          {user.role}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-gray-300">
                        {user.branch}
                      </td>

                      <td className="px-4 py-4">
                        {user.active ? (
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

              {filteredUsers.length === 0 && (
                <p className="py-10 text-center text-sm text-gray-400">
                  No se encontraron usuarios.
                </p>
              )}
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Mostrando {filteredUsers.length} de {users.length} usuarios
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
                <h2 className="text-xl font-bold">Nuevo usuario</h2>

                <p className="mt-1 text-sm text-gray-400">
                  Registra un usuario para el sistema.
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
                  Nombre completo
                </label>

                <input
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Nombre del usuario"
                  className="w-full rounded-lg border border-gray-700 bg-[#202521] px-3 py-2.5 text-sm outline-none focus:border-[#d9a441]"
                />
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
                  placeholder="usuario@frija.com"
                  className="w-full rounded-lg border border-gray-700 bg-[#202521] px-3 py-2.5 text-sm outline-none focus:border-[#d9a441]"
                />
              </div>

              <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Rol
                  </label>

                  <select
                    value={form.role}
                    onChange={e => setForm({ ...form, role: e.target.value as User['role'] })}
                    className="w-full rounded-lg border border-gray-700 bg-[#202521] px-3 py-2.5 text-sm outline-none focus:border-[#d9a441]"
                  >
                    <option value="Administrador">Administrador</option>
                    <option value="Vendedor">Vendedor</option>
                    <option value="Inventario">Inventario</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Sucursal
                  </label>

                  <select
                    required
                    value={form.branch}
                    onChange={e => setForm({ ...form, branch: e.target.value })}
                    className="w-full rounded-lg border border-gray-700 bg-[#202521] px-3 py-2.5 text-sm outline-none focus:border-[#d9a441]"
                  >
                    <option value="">Seleccionar sucursal</option>
                    <option value="Tijuana">Tijuana</option>
                    <option value="Mexicali">Mexicali</option>
                    <option value="Ensenada">Ensenada</option>
                    <option value="Tecate">Tecate</option>
                  </select>
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
                  Guardar usuario
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
