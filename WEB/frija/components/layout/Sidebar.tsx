'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuSections = [
  {
    title: 'GENERAL',
    items: [
      { name: 'Inicio', href: '/Inicio', icon: '⌂' },
    ],
  },
  {
    title: 'CATÁLOGO',
    items: [
      { name: 'Productos', href: '/Productos', icon: '▦' },
      { name: 'Marcas', href: '/Marcas', icon: '◇' },
      { name: 'Categorías', href: '/Categorias', icon: '▤' },
    ],
  },
  {
    title: 'OPERACIONES',
    items: [
      { name: 'Inventario', href: '/Inventario', icon: '▣' },
      { name: 'Importaciones', href: '/Importaciones', icon: '⇩' },
      { name: 'Ventas', href: '/Ventas', icon: '▧' },
      { name: 'Pagos', href: '/Pagos', icon: '$' },
    ],
  },
  {
    title: 'LOGÍSTICA',
    items: [
      { name: 'Proveedores', href: '/Proveedores', icon: '♧' },
      { name: 'Envíos', href: '/Envios', icon: '⇢' },
      { name: 'Sucursales', href: '/Sucursales', icon: '⌖' },
    ],
  },
  {
    title: 'ADMINISTRACIÓN',
    items: [
      { name: 'Usuarios', href: '/Usuarios', icon: '♙' },
      { name: 'Reportes', href: '/Reportes', icon: '▥' },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-white/10 bg-[#202521] text-white">
      <div className="border-b border-white/10 px-6 py-6">
        <h1 className="text-2xl font-bold tracking-widest text-[#d9a441]">
          FRIJA
        </h1>
        <p className="mt-1 text-xs text-gray-400">
          Brewery Management System
        </p>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-5">
        {menuSections.map((section) => (
          <div key={section.title}>
            <p className="mb-3 px-3 text-[10px] font-semibold tracking-widest text-gray-500">
              {section.title}
            </p>

            <div className="space-y-1">
              {section.items.map((item) => {
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      active
                        ? 'bg-[#d9a441] font-semibold text-[#202521]'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="w-5 text-center text-base">
                      {item.icon}
                    </span>
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 px-5 py-4">
        <p className="text-xs text-gray-500">FRIJA © 2026</p>
        <p className="mt-1 text-xs text-gray-400">
          Sistema administrativo
        </p>
      </div>
    </aside>
  );
}
