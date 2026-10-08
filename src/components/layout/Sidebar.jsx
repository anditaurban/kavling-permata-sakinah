import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Layers,
  MapPin,
  Users,
  Receipt,
  CreditCard,
  FileBarChart,
  UserCog,
  Landmark,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const { role } = useAuth();

  const navigationItems = [
    {
      label: 'Ringkasan',
      items: [
        { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, roles: ['OWNER', 'ADMIN', 'STAFF'] },
        { name: 'POS Kasir', to: '/pos', icon: ShoppingCart, roles: ['OWNER', 'ADMIN', 'STAFF'] },
      ],
    },
    {
      label: 'Operasional Properti',
      items: [
        { name: 'Proyek', to: '/admin/projects', icon: Layers, roles: ['OWNER', 'ADMIN'] },
        { name: 'Kavling', to: '/admin/lots', icon: MapPin, roles: ['OWNER', 'ADMIN', 'STAFF'] },
        { name: 'Customer & Lead', to: '/admin/customers', icon: Users, roles: ['OWNER', 'ADMIN', 'STAFF'] },
      ],
    },
    {
      label: 'Keuangan & Transaksi',
      items: [
        { name: 'Transaksi', to: '/admin/transactions', icon: Receipt, roles: ['OWNER', 'ADMIN', 'STAFF'] },
        { name: 'Pembayaran', to: '/admin/payments', icon: CreditCard, roles: ['OWNER', 'ADMIN', 'STAFF'] },
      ],
    },
    {
      label: 'Administrasi',
      items: [
        { name: 'Laporan Penjualan', to: '/admin/reports', icon: FileBarChart, roles: ['OWNER', 'ADMIN'] },
        { name: 'Pengguna / Tim', to: '/admin/users', icon: UserCog, roles: ['OWNER', 'ADMIN'] },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Shell */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-white tracking-tight block">Permata Sakinah</span>
              <span className="text-[10px] text-slate-400 block -mt-0.5">Management Panel</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg"
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navigationItems.map((group, groupIdx) => {
            const filteredItems = group.items.filter((item) => item.roles.includes(role));
            if (filteredItems.length === 0) return null;

            return (
              <div key={groupIdx}>
                <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  {group.label}
                </p>
                <div className="space-y-1">
                  {filteredItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          isActive
                            ? 'bg-primary text-white font-semibold'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`
                      }
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer info & public link */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40">
          <NavLink
            to="/"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              Lihat Website Publik
            </span>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">Web</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
}
