'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setMessage(data.message || "No fue posible iniciar sesión.");
        return;
      }

      // Guardar los datos básicos del usuario para esta versión de prueba.
      localStorage.setItem("frija_user", JSON.stringify(data.user));

      router.push("/Inicio");

    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setMessage("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative isolate -mt-24 flex min-h-screen flex-1 flex-col items-center justify-center overflow-hidden px-4 pb-8 pt-24">

      {/* FONDO: imagen (public/Images/bg_login.jpg) con capa oscura para que la tarjeta se lea bien.
          Para aclarar u oscurecer la imagen cambia bg-black/40. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[url('/Images/bg_login.jpg')] bg-cover bg-center"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-black/40" />

      {/* TARJETA FLOTANTE */}
      <style>{`
        @keyframes login-card-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .login-card-in { animation: login-card-in 0.5s ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .login-card-in { animation: none; }
        }
      `}</style>
      <div className="login-card-in w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.07] px-8 py-10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:px-10">

        <div className="flex flex-col items-center">

          {/* LOGO */}
          <div className="mb-10 flex flex-col items-center">
            <img
              src="/Images/login_logo.png"
              alt="Logo FRIJA"
              className="h-auto w-56 max-w-full"
            />
          </div>

          {/* FORMULARIO */}
          <form
            className="w-full flex flex-col gap-5"
            onSubmit={handleLogin}
          >

            {/* CORREO */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs text-gray-300 font-medium">
                Correo electrónico
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@frija.com"
                required
                className="bg-[#fcfbf9] text-gray-800 text-sm rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-[#d9a441]"
              />
            </div>

            {/* CONTRASEÑA */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs text-gray-300 font-medium">
                Contraseña
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
                className="bg-[#fcfbf9] text-gray-800 text-sm rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-[#d9a441]"
              />
            </div>

            {/* MENSAJE */}
            {message && (
              <p className="text-sm text-red-400 text-center">
                {message}
              </p>
            )}

            {/* BOTÓN
                SOLO PARA PRUEBAS: salta el login y va directo a /Inicio.
                Para restaurar el login real: type="submit" y quita el onClick. */}
            <button
              type="button"
              onClick={() => router.push("/Inicio")}
              disabled={loading}
              className="mt-3 border border-white/15 bg-black text-white enabled:hover:border-[#d9a441] enabled:hover:bg-[#d9a441] enabled:hover:text-neutral-900 disabled:opacity-50 font-medium py-3 rounded-full transition-all shadow-md text-sm cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? "Verificando..." : "Iniciar sesión"}
            </button>

          </form>

          {/* ENLACE INFERIOR */}
          <div className="mt-10">
            <a
              href="#"
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}