import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from './Navbar';
import { Landmark } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function PublicLayout() {
  const { role } = useAuth();
  const isInternal = role === 'OWNER' || role === 'ADMIN' || role === 'STAFF';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Public Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-white">
                <Landmark className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-slate-900">
                Permata Sakinah
              </span>
              <span className="text-xs text-slate-400 ml-2">
                © {new Date().getFullYear()} PT Permata Sakinah Properti. Hak cipta dilindungi.
              </span>
            </div>
            <div className="flex items-center gap-6 text-xs text-slate-500">
              <Link to="/projects" className="hover:text-primary transition-colors">
                Kavling Tersedia
              </Link>
              {isInternal ? (
                <>
                  <Link to="/pos" className="hover:text-primary transition-colors">
                    POS Kasir
                  </Link>
                  <Link to="/dashboard" className="hover:text-primary transition-colors">
                    Dashboard Internal
                  </Link>
                </>
              ) : (
                <Link to="/login" className="hover:text-primary transition-colors">
                  Akses Internal
                </Link>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
