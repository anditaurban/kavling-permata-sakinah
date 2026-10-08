import React from 'react';
import { Outlet, NavLink, Link, Navigate, useLocation } from 'react-router-dom';
import { Landmark, Home, MapPin, CreditCard, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import RoleSwitcher from './RoleSwitcher';

export default function CustomerLayout() {
  const { role, currentUser, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  // If Guest, redirect to login
  if (!isAuthenticated || role === 'GUEST') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If internal staff/admin visits customer layout, allow or provide clear header
  const customerNavItems = [
    { label: 'Ringkasan Akun', to: '/customer', icon: Home },
    { label: 'Kavling Saya', to: '/customer/lots', icon: MapPin },
    { label: 'Pembayaran & Tagihan', to: '/customer/payments', icon: CreditCard },
    { label: 'Profil Saya', to: '/customer/profile', icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Dev Simulator Bar only when internal user */}
      {role !== 'CUSTOMER' && role !== 'GUEST' && (
        <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-mono text-[11px] text-slate-300">Customer Portal Session</span>
          </div>
          <RoleSwitcher />
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
              <Landmark className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 tracking-tight block">
                Permata Sakinah
              </span>
              <span className="text-[10px] text-slate-500 block -mt-1 font-medium">
                Portal Pelanggan
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <div className="w-8 h-8 rounded-full bg-brand-100 text-primary flex items-center justify-center font-bold">
                {currentUser?.name?.charAt(0) || 'C'}
              </div>
              <div className="text-left">
                <span className="block font-semibold text-slate-800">{currentUser?.name || 'Customer'}</span>
                <span className="block text-[11px] text-slate-500">{currentUser?.email || ''}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-slate-100 transition-colors"
              title="Keluar"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Sub-navigation */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-6 overflow-x-auto border-t border-slate-100 text-sm">
          {customerNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/customer'}
                className={({ isActive }) =>
                  `flex items-center gap-2 py-3 border-b-2 font-medium transition-colors whitespace-nowrap text-xs sm:text-sm ${
                    isActive
                      ? 'border-primary text-primary font-semibold'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            );
          })}
        </div>
      </header>

      {/* Main Body Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
