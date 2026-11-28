// Un bloque de "Actividad Reciente".
// Recibe los datos de una sola actividad y dibuja el mismo diseño que tenías.

export type Actividad = {
  id: number | string;
  nombre: string;    // Ej. "Factura Emitida"
  cliente: string;   // Ej. "Cliente 1"
  sucursal: string;  // Ej. "Sucursal 1"
  hora: string;      // Ej. "hace 25 minutos"
};

export default function BloqueActividad({
  id,
  nombre,
  cliente,
  sucursal,
  hora,
}: Actividad) {
  return (
    <div
      data-actividad-id={id}
      className="bg-[#323933] p-4 rounded-lg flex items-center justify-between"
    >
      <div className="flex items-center gap-4">
        <div className="w-6 h-6 bg-white rounded-sm"></div>
        <div>
          <p className="text-sm font-semibold">{nombre}</p>
          <p className="text-xs text-gray-400">
            Cliente: {cliente} &nbsp;&nbsp;&nbsp; Sucursal: {sucursal}
          </p>
        </div>
      </div>
      <span className="text-xs text-gray-400">{hora}</span>
    </div>
  );
}