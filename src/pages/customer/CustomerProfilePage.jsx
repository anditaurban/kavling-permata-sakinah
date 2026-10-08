import React from 'react';
import { Card, Input, Button } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function CustomerProfilePage() {
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  const handleSave = (e) => {
    e.preventDefault();
    addToast('Data profil berhasil disimpan (simulasi frontend)', 'success');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Profil Pelanggan</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Perbarui data kontak dan alamat korespondensi pengiriman dokumen SHM.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Nama Lengkap Sesuai KTP"
            defaultValue={currentUser?.name || ''}
            required
          />
          <Input
            label="Nomor WhatsApp / HP"
            defaultValue={currentUser?.phone || '081234567893'}
            required
          />
          <Input
            label="Alamat Email"
            type="email"
            defaultValue={currentUser?.email || ''}
            required
          />
          <Input
            label="Alamat Lengkap Domisili"
            defaultValue="Jl. Merak No. 12, Cikarang Barat, Bekasi"
            required
          />
          <div className="pt-2">
            <Button type="submit">Simpan Perubahan</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
