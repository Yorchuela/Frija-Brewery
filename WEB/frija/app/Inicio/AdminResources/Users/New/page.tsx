"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { crearUsuarioEnBD, NuevoUsuarioPayload } from "./actions";

const ROLES_DISPONIBLES = [
  "Administrador",
  "Gerente",
  "Vendedor",
  "Inventario",
  "Clientes",
];

export default function AgregarUsuarioPage() {
  const router = useRouter();

  const [form, setForm] = useState<NuevoUsuarioPayload>({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    correo: "",
    telefono: "",
    contrasena: "",
    rol: "",
  });

  const [rolAbierto, setRolAbierto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [feedback, setFeedback] = useState<{
    tipo: "error" | "exito";
    texto: string;
  } | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cierra el menú desplegable de Rol si se hace clic fuera
  useEffect(() => {
    function manejarClicFuera(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setRolAbierto(false);
      }
    }
    document.addEventListener("mousedown", manejarClicFuera);
    return () => document.removeEventListener("mousedown", manejarClicFuera);
  }, []);

  const handleChange = (campo: keyof NuevoUsuarioPayload, valor: string) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    if (feedback) setFeedback(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setFeedback(null);

    const respuesta = await crearUsuarioEnBD(form);

    setEnviando(false);

    if (!respuesta.ok) {
      setFeedback({ tipo: "error", texto: respuesta.mensaje });
      return;
    }

    setFeedback({ tipo: "exito", texto: respuesta.mensaje });
    // Cuando ya tengas BD real, puedes redirigir de vuelta a la lista:
    // router.push("/Inicio/Admin_resources/users");
  };

  return (
    <div className="min-h-screen text-white flex flex-col font-sans">
      {/* BARRA SUPERIOR CLARA DE LA VISTA */}
      <div className="w-full bg-[#f4f1ec] text-[#1f2420] px-8 py-3.5 border-b border-black/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-normal leading-none">+</span>
          <h1 className="text-lg font-medium tracking-tight">
            Agregar Usuario
          </h1>
        </div>

        <div className="text-right leading-tight">
          <p className="text-base font-medium text-[#2a302b]">Admin_User</p>
          <p className="text-xs italic text-gray-500">Administrador</p>
        </div>
      </div>

      {/* FORMULARIO PRINCIPAL */}
      <main className="flex-1 p-8 max-w-6xl mx-auto w-full flex flex-col justify-between">
        <form onSubmit={handleSubmit} className="flex flex-col gap-10 mt-2">
          {/* BLOQUE 1: Nombre, Apellido Materno, Apellido Paterno */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
            {/* Columna Izquierda */}
            <div className="flex flex-col gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.nombre}
                  onChange={(e) => handleChange("nombre", e.target.value)}
                  className="w-full bg-[#4c514d] text-white text-sm px-4 py-2.5 rounded-lg border border-transparent focus:border-[#d9a441] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Apellido Paterno <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.apellidoPaterno}
                  onChange={(e) =>
                    handleChange("apellidoPaterno", e.target.value)
                  }
                  className="w-full bg-[#4c514d] text-white text-sm px-4 py-2.5 rounded-lg border border-transparent focus:border-[#d9a441] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Columna Derecha */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Apellido Materno
              </label>
              <input
                type="text"
                value={form.apellidoMaterno}
                onChange={(e) =>
                  handleChange("apellidoMaterno", e.target.value)
                }
                className="w-full bg-[#4c514d] text-white text-sm px-4 py-2.5 rounded-lg border border-transparent focus:border-[#d9a441] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* BLOQUE 2: Correo, Contraseña, Teléfono */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
            {/* Columna Izquierda */}
            <div className="flex flex-col gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Correo <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={form.correo}
                  onChange={(e) => handleChange("correo", e.target.value)}
                  className="w-full bg-[#4c514d] text-white text-sm px-4 py-2.5 rounded-lg border border-transparent focus:border-[#d9a441] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Telefono
                </label>
                <input
                  type="tel"
                  value={form.telefono}
                  onChange={(e) => handleChange("telefono", e.target.value)}
                  className="w-full bg-[#4c514d] text-white text-sm px-4 py-2.5 rounded-lg border border-transparent focus:border-[#d9a441] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Columna Derecha */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={form.contrasena}
                onChange={(e) => handleChange("contrasena", e.target.value)}
                className="w-full bg-[#4c514d] text-white text-sm px-4 py-2.5 rounded-lg border border-transparent focus:border-[#d9a441] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* BLOQUE 3: Rol (Dropdown personalizado amarillo) + Botones inferiores */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="w-full md:w-1/2 md:pr-8" ref={dropdownRef}>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Rol <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setRolAbierto((prev) => !prev)}
                  className="w-full bg-[#d9a441] hover:bg-[#e3b14f] text-[#1f2420] text-sm font-medium px-4 py-2.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span>{form.rol || "Seleccionar >>"}</span>
                </button>

                {rolAbierto && (
                  <div className="mt-1.5 ml-3 w-full bg-[#f4cd78] text-[#1f2420] rounded-lg shadow-xl overflow-hidden z-20 border border-[#d9a441]">
                    {ROLES_DISPONIBLES.map((rolItem) => (
                      <button
                        key={rolItem}
                        type="button"
                        onClick={() => {
                          handleChange("rol", rolItem);
                          setRolAbierto(false);
                        }}
                        className={`w-full text-left px-5 py-2.5 text-sm transition-colors cursor-pointer ${
                          form.rol === rolItem
                            ? "bg-[#d9a441] font-semibold"
                            : "hover:bg-[#ecc063]"
                        }`}
                      >
                        {rolItem}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* MENSAJE DE ESTADO Y BOTONES CANCELAR / + AGREGAR */}
            <div className="flex flex-col items-end gap-3">
              {feedback && (
                <p
                  className={`text-xs font-medium ${
                    feedback.tipo === "error"
                      ? "text-red-400"
                      : "text-[#d9a441]"
                  }`}
                >
                  {feedback.texto}
                </p>
              )}

              <div className="flex items-center gap-6">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="text-sm font-medium text-gray-200 hover:text-white transition-colors cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={enviando}
                  className="bg-[#d9a441] hover:bg-[#e3b14f] disabled:opacity-60 text-white font-medium text-sm px-8 py-3 rounded-lg shadow-md transition-colors cursor-pointer"
                >
                  {enviando ? "Guardando..." : "+ Agregar"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}