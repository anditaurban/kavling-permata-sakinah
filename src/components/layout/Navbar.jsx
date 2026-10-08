import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Landmark, ArrowRight, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { role, isAuthenticated, logout, currentUser } = useAuth();

  const navLinks = [
    { label: 'Beranda', href: '/' },
    { label: 'Proyek Kavling', href: '/projects' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white shadow-xs group-hover:bg-brand-600 transition-colors">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 tracking-tight block">
                Permata Sakinah
              </span>
              <span className="text-[10px] text-slate-500 block -mt-1 font-medium">
                Kavling Siap Bangun
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive ? 'text-primary font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            {!isAuthenticated || role === 'GUEST' ? (
              // Guest Actions (Hanya Masuk & Daftar Akun)
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Masuk
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Daftar Akun
                  </Button>
                </Link>
              </>
            ) : role === 'CUSTOMER' ? (
              // Logged in as Customer
              <>
                <Link to="/customer">
                  <Button variant="secondary" size="sm" icon={User}>
                    Portal Saya
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={logout} icon={LogOut}>
                  Keluar
                </Button>
              </>
            ) : (
              // Logged in as Internal (OWNER, ADMIN, STAFF)
              <>
                <Link to="/dashboard">
                  <Button variant="secondary" size="sm" icon={User}>
                    Panel Operasional
                  </Button>
                </Link>
                <Link to="/pos">
                  <Button variant="primary" size="sm">
                    Buka POS
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={logout} icon={LogOut}>
                  Keluar
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Buka menu navigasi"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {!isAuthenticated || role === 'GUEST' ? (
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full justify-center">
                    Masuk
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full justify-center">
                    Daftar Akun
                  </Button>
                </Link>
              </div>
            ) : role === 'CUSTOMER' ? (
              <div className="flex flex-col gap-2">
                <Link to="/customer" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" size="sm" className="w-full justify-center">
                    Portal Saya
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full justify-center">
                  Keluar
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" size="sm" className="w-full justify-center">
                    Panel Operasional
                  </Button>
                </Link>
                <Link to="/pos" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full justify-center">
                    Buka POS
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full justify-center">
                  Keluar
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
