import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Landmark, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button, Input, Card } from '../../components/common';
import { useToast } from '../../context/ToastContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agree: true,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      addToast('Konfirmasi kata sandi tidak cocok', 'error');
      return;
    }

    if (!formData.agree) {
      addToast('Harap setujui syarat dan ketentuan', 'warning');
      return;
    }

    setLoading(true);

    // Simulate registration then auto login as CUSTOMER
    setTimeout(() => {
      login('CUSTOMER');
      addToast('Pendaftaran akun berhasil! Selamat datang di Permata Sakinah.', 'success');
      navigate('/customer');
    }, 600);
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm">
            <Landmark className="w-6 h-6" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-slate-900 tracking-tight">
            Daftar Akun Baru
          </h2>
          <p className="mt-1.5 text-sm text-slate-600">
            Mulai langkah investasi kavling siap bangun impian keluarga Anda
          </p>
        </div>

        <Card padding="spacious">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nama Lengkap"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Contoh: Budi Santoso"
              required
            />

            <Input
              label="Alamat Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="nama@email.com"
              required
            />

            <Input
              label="Nomor WhatsApp"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="081234567890"
              helperText="Untuk konfirmasi info kavling & jadwal survei"
              required
            />

            <Input
              label="Kata Sandi"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimal 6 karakter"
              required
            />

            <Input
              label="Konfirmasi Kata Sandi"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Ulangi kata sandi"
              required
            />

            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600">
                <input
                  type="checkbox"
                  name="agree"
                  checked={formData.agree}
                  onChange={handleChange}
                  className="mt-0.5 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <span>
                  Saya menyetujui syarat & ketentuan serta privasi pemesanan kavling Permata Sakinah
                </span>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full justify-center mt-2"
              size="lg"
              isLoading={loading}
            >
              Daftar Sekarang
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Sudah memiliki akun?{' '}
              <Link to="/login" className="font-semibold text-primary hover:text-brand-700">
                Masuk di sini
              </Link>
            </p>
          </div>
        </Card>

        {/* Value props mini */}
        <div className="grid grid-cols-2 gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-slate-200/70">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Legalitas Aman & SHM</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-slate-200/70">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Skema Bebas Riba</span>
          </div>
        </div>
      </div>
    </div>
  );
}
