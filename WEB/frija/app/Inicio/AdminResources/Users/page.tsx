"use client";

import { useState } from "react";
import Link from "next/link";
import UsuarioBloque, { Usuario } from "./users_list";

interface TablaUsuariosProps {
  usuariosIniciales?: Usuario[];
}

export default function TablaUsuarios({
  usuariosIniciales = [],
}: TablaUsuariosProps) {
  const [busqueda, setBusqueda] = useState("");

  const listaSegura = usuariosIniciales ?? [];

  const usuariosFiltrados = listaSegura.filter(
    (usuario) =>
      (usuario.nombre ?? "").toLowerCase().includes(busqueda.toLowerCase()) ||
      (usuario.rol ?? "").toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen text-white flex flex-col font-sans">
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        {/* ENCABEZADO: Título + Breadcrumb a la izquierda, Buscador + Botón a la derecha */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
            <p className="text-sm italic text-gray-400 mt-1">
              <Link
                href="/Inicio"
                className="hover:text-[#d9a441] transition-colors"
              >
                Inicio
              </Link>{" "}
              &gt;{" "}
              <Link
                href="/Inicio/Admin_resources"
                className="hover:text-[#d9a441] transition-colors"
              >
                Administración
              </Link>{" "}
              &gt; Usuarios
            </p>
          </div>

          {/* Barra de búsqueda y botón Agregar Usuario */}
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar usuario"
              className="w-64 sm:w-80 bg-[#5b645c]/70 text-white placeholder:text-gray-300 placeholder:italic text-sm px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:border-[#d9a441] transition-colors"
            />

            <Link
              href="/Inicio/Admin_resources/users/nuevo"
              className="bg-[#39423b] hover:bg-[#d9a441] text-gray-200 hover:text-[#120f0d] border border-gray-700 hover:border-[#d9a441] text-sm font-medium px-4 py-2 rounded-md transition-colors cursor-pointer"
            >
              + Agregar Usuario
            </Link>
          </div>
        </div>

        {/* TABLA DE USUARIOS */}
        <div className="bg-[#2a302b] rounded-xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#39423b] border-b border-gray-700 text-xs font-medium text-gray-300">
                  <th className="py-3 px-6 w-5/12">Nombre</th>
                  <th className="py-3 px-6 w-4/12">Rol</th>
                  <th className="py-3 px-6 w-3/12">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {usuariosIniciales.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-10 px-6 text-center text-sm text-gray-400"
                    >
                      No hay usuarios registrados en la base de datos.
                    </td>
                  </tr>
                ) : usuariosFiltrados.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-10 px-6 text-center text-sm text-gray-400"
                    >
                      No se encontraron usuarios con &quot;{busqueda}&quot;.
                    </td>
                  </tr>
                ) : (
                  usuariosFiltrados.map((user) => (
                    <UsuarioBloque
                      key={user.id}
                      id={user.id}
                      nombre={user.nombre}
                      rol={user.rol}
                      activo={user.activo}
                      onModificar={(id) => {
                        console.log("Modificar usuario:", id);
                      }}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}