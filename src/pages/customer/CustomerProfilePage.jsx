import React, { useState } from 'react';
import { Card, Input, Button } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api/adapter';

export default function CustomerProfilePage() {
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    address: currentUser?.address || 'Jl. Merak No. 12, Cikarang Barat, Bekasi',
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (currentUser?.customer_id) {
        await api.updateCustomer(currentUser.customer_id, formData);
        addToast('Data profil berhasil diperbarui via REST API!', 'success');
      } else {
        addToast('Data profil berhasil disimpan!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Gagal menyimpan profil', 'error');
    } finally {
      setSubmitting(false);
    }
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
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Nomor WhatsApp / HP"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
          <Input
            label="Alamat Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            label="Alamat Lengkap Domisili"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
          />
          <div className="pt-2">
            <Button type="submit" isLoading={submitting}>
              Simpan Perubahan (API)
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
