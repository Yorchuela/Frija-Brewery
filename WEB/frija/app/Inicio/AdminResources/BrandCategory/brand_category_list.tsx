"use client";

export type ElementoCatalogo = {
  id: number | string;
  nombre: string;
  activo: boolean;
};

interface ElementoBloqueProps extends ElementoCatalogo {
  onEditar?: (id: number | string) => void;
}

export default function ElementoBloque({
  id,
  nombre,
  activo,
  onEditar,
}: ElementoBloqueProps) {
  return (
    <div
      data-elemento-id={id}
      className={`px-6 py-3.5 border-b border-gray-800/80 last:border-b-0 flex items-center justify-between transition-colors ${
        activo
          ? "bg-[#323933] hover:bg-[#3a423b]"
          : "bg-[#432c2d] hover:bg-[#4e3435]"
      }`}
    >
      {/* IZQUIERDA: Círculo numerado + Nombre + Estado Inactivo */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-8 h-8 rounded-full bg-[#202521] border border-gray-700 flex items-center justify-center text-sm font-semibold text-gray-200 shrink-0">
          {id}
        </div>

        <span className="text-sm font-medium text-gray-100 truncate">
          {nombre}
        </span>

        {!activo && (
          <span className="text-xs font-semibold text-red-500 ml-4 shrink-0">
            Inactivo
          </span>
        )}
      </div>

      {/* DERECHA: Acción Editar */}
      <button
        type="button"
        onClick={() => onEditar?.(id)}
        className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-[#d9a441] transition-colors cursor-pointer shrink-0 ml-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
        <span>Editar</span>
      </button>
    </div>
  );
}