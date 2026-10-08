import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Landmark, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button, Input, Card } from '../../components/common';
import { useToast } from '../../context/ToastContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, availableUsers } = useAuth();
  const { addToast } = useToast();
  const [email, setEmail] = useState('customer@permatasakinah.id');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);

  const handleQuickLogin = (role) => {
    login(role);
    addToast(`Berhasil masuk sebagai ${role}`, 'success');
    if (role === 'CUSTOMER') {
      navigate('/customer');
    } else {
      navigate('/dashboard');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      // Find matching user from mock data or default to CUSTOMER
      const found = availableUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      const roleToSet = found ? found.role : 'CUSTOMER';

      login(roleToSet);
      addToast(`Selamat datang kembali, ${found ? found.name : 'Customer'}!`, 'success');
      setLoading(false);

      if (roleToSet === 'CUSTOMER') {
        navigate('/customer');
      } else {
        navigate('/dashboard');
      }
    }, 400);
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm">
            <Landmark className="w-6 h-6" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-slate-900 tracking-tight">
            Masuk ke Akun Anda
          </h2>
          <p className="mt-1.5 text-sm text-slate-600">
            Akses status kavling, riwayat cicilan, dan portal manajemen
          </p>
        </div>

        <Card padding="spacious">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Alamat Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              required
            />
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700">Kata Sandi</label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    addToast('Fitur reset sandi: silakan hubungi admin via WhatsApp', 'info');
                  }}
                  className="text-xs text-primary hover:text-brand-700 font-medium"
                >
                  Lupa sandi?
                </a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            <Button
              type="submit"
              className="w-full justify-center mt-2"
              size="lg"
              isLoading={loading}
            >
              Masuk Sekarang
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Belum punya akun kavling?{' '}
              <Link to="/register" className="font-semibold text-primary hover:text-brand-700">
                Daftar akun baru
              </Link>
            </p>
          </div>

          {/* Quick Role Simulator Presets */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Simulasi Login Cepat:
              </span>
              <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                Demo Mode
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {availableUsers.map((u) => (
                <button
                  key={u.role}
                  type="button"
                  onClick={() => handleQuickLogin(u.role)}
                  className="px-3 py-2 text-left rounded-lg border border-slate-200 hover:border-primary hover:bg-brand-50/50 transition-all text-xs group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 group-hover:text-primary transition-colors">
                      {u.role}
                    </span>
                    <UserCheck className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary" />
                  </div>
                  <span className="text-[11px] text-slate-500 truncate block mt-0.5">{u.name}</span>
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
