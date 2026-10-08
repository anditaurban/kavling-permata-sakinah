import React from 'react';
import { Menu, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import RoleSwitcher from './RoleSwitcher';
import Dropdown from '../common/Dropdown';

export default function Topbar({ onOpenSidebar }) {
  const { currentUser, role, logout } = useAuth();

  const userMenuItems = [
    {
      label: `Masuk sebagai: ${currentUser?.name || 'User'}`,
      disabled: true,
    },
    {
      divider: true,
    },
    {
      label: 'Keluar Simulasi',
      icon: LogOut,
      danger: true,
      onClick: logout,
    },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile Toggle & Page context */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          aria-label="Buka menu navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:block">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Sistem Penjualan Kavling
          </span>
        </div>
      </div>

      {/* Right: Role Switcher & User Profile */}
      <div className="flex items-center gap-4">
        {/* Role Simulator */}
        <RoleSwitcher />

        <div className="h-4 w-px bg-slate-200 hidden sm:block" />

        {/* User Pill */}
        <Dropdown
          align="right"
          trigger={
            <button
              type="button"
              className="flex items-center gap-2.5 p-1 rounded-full sm:rounded-lg hover:bg-slate-100 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-600 font-semibold text-xs">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
              <div className="hidden sm:block">
                <span className="text-xs font-semibold text-slate-800 block leading-tight">
                  {currentUser?.name || 'Pengguna'}
                </span>
                <span className="text-[10px] text-slate-500 block leading-tight font-medium">
                  {role}
                </span>
              </div>
            </button>
          }
          items={userMenuItems}
        />
      </div>
    </header>
  );
}
