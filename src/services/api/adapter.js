import { apiRequest, setStoredToken, clearStoredToken } from './client';

/**
 * Data Normalizers for frontend backward compatibility & unified field access
 */
function normalizeProject(project) {
  if (!project) return project;
  return {
    ...project,
    total_lots: project.total_plots ?? project.total_lots ?? 0,
    available_lots: project.available_plots ?? project.available_lots ?? 0,
    cover_image: project.cover_image_url || project.cover_image || '',
    location: project.location_text || project.location || '',
    facilities: project.facilities || [
      'Jalan Beton 6m',
      'Saluran Drainase',
      'Tiang Listrik PLN',
      'Masjid Komplek',
      'One Gate System',
    ],
  };
}

function normalizePlot(plot) {
  if (!plot) return plot;
  const blockRaw = plot.block_name || plot.block || 'A';
  const blockClean = blockRaw.replace(/^Blok\s+/i, '');
  return {
    ...plot,
    code: plot.plot_code || plot.code || `Unit-${plot.id}`,
    plot_code: plot.plot_code || plot.code || `Unit-${plot.id}`,
    block: blockClean,
    block_name: plot.block_name || `Blok ${blockClean}`,
    area_m2: Number(plot.area_sqm ?? plot.area_m2 ?? 0),
    area_sqm: Number(plot.area_sqm ?? plot.area_m2 ?? 0),
    price: Number(plot.price || 0),
    notes: plot.description || plot.notes || 'Kavling siap bangun dengan legalitas aman.',
    status: plot.status || 'AVAILABLE',
  };
}

function normalizeSale(sale) {
  if (!sale) return sale;
  const totalAmount = Number(sale.total_amount ?? sale.sale_price ?? sale.amount ?? 0);
  const paidAmount = Number(sale.total_paid ?? sale.paid_amount ?? 0);
  const remainingAmount = Number(
    sale.balance_remaining ?? sale.remaining_amount ?? Math.max(0, totalAmount - paidAmount)
  );

  return {
    ...sale,
    transaction_number: sale.sale_number || sale.transaction_number || `SALE-${sale.id}`,
    sale_number: sale.sale_number || sale.transaction_number || `SALE-${sale.id}`,
    lot_code: sale.plot_code || sale.lot_code || '-',
    amount: totalAmount,
    total_amount: totalAmount,
    paid_amount: paidAmount,
    total_paid: paidAmount,
    remaining_amount: remainingAmount,
    balance_remaining: remainingAmount,
    type: sale.booking_id ? 'BOOKING' : 'CASH',
  };
}

function normalizePayment(payment) {
  if (!payment) return payment;
  return {
    ...payment,
    reference: payment.reference_number || payment.payment_number || payment.reference || `PAY-${payment.id}`,
    payment_number: payment.payment_number || payment.reference_number || payment.reference || `PAY-${payment.id}`,
    payment_date: payment.paid_at || payment.created_at || payment.payment_date || new Date().toISOString(),
    amount: Number(payment.amount || 0),
    notes: payment.notes || 'Pembayaran kavling',
    transaction_id: payment.sale_id || payment.booking_id || payment.transaction_id || null,
  };
}

function normalizeCustomer(customer) {
  if (!customer) return customer;
  return {
    ...customer,
    name: customer.name || 'Customer',
    phone: customer.phone || '-',
    email: customer.email || '-',
    address: customer.address || '-',
    source: customer.source || 'Website',
    lead_status: customer.lead_status || 'NEW',
    notes: customer.notes || '',
  };
}

/**
 * Unified REST API Adapter
 * Directly integrated with Backend REST API (docs/API-SPEC.md & collection.json)
 */
class ApiAdapter {
  // ==========================================
  // 1. Auth Service
  // ==========================================
  async login(email, password) {
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res.success && res.data?.token) {
      setStoredToken(res.data.token);
    }
    return res;
  }

  async getMe() {
    return await apiRequest('/auth/me');
  }

  async logout() {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    } finally {
      clearStoredToken();
    }
    return { success: true, data: null };
  }

  // ==========================================
  // 2. Projects Service
  // ==========================================
  async getProjects() {
    const res = await apiRequest('/projects');
    if (res.success && Array.isArray(res.data)) {
      res.data = res.data.map(normalizeProject);
    }
    return res;
  }

  async getProjectById(idOrSlug) {
    const res = await apiRequest(`/projects/${idOrSlug}`);
    if (res.success && res.data) {
      res.data = normalizeProject(res.data);
    }
    return res;
  }

  async createProject(payload) {
    const body = {
      name: payload.name,
      slug: payload.slug || payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: payload.description || '',
      location_text: payload.location_text || payload.location || '',
      address: payload.address || payload.location || '',
      status: payload.status || 'ACTIVE',
      cover_image_url:
        payload.cover_image_url ||
        payload.cover_image ||
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80',
    };

    const res = await apiRequest('/projects', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    if (res.success && res.data) {
      res.data = normalizeProject(res.data);
    }
    return res;
  }

  async updateProject(id, payload) {
    const res = await apiRequest(`/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    if (res.success && res.data) {
      res.data = normalizeProject(res.data);
    }
    return res;
  }

  // ==========================================
  // 3. Plots / Kavling Service
  // ==========================================
  async getLots(projectId, filters = {}) {
    const params = new URLSearchParams();
    if (projectId) params.set('projectId', projectId);
    if (filters.status) params.set('status', filters.status);
    if (filters.block) params.set('block', filters.block);
    if (filters.search) params.set('search', filters.search);
    if (filters.min_price) params.set('min_price', filters.min_price);
    if (filters.max_price) params.set('max_price', filters.max_price);

    const queryStr = params.toString() ? `?${params.toString()}` : '';
    const res = await apiRequest(`/plots${queryStr}`);

    if (res.success && Array.isArray(res.data)) {
      res.data = res.data.map(normalizePlot);
    }
    return res;
  }

  async getLotById(id) {
    const res = await apiRequest(`/plots/${id}`);
    if (res.success && res.data) {
      res.data = normalizePlot(res.data);
    }
    return res;
  }

  async createPlot(payload) {
    const body = {
      project_id: Number(payload.project_id),
      plot_code: payload.plot_code || payload.code,
      block_name: payload.block_name || (payload.block ? `Blok ${payload.block}` : 'Blok A'),
      area_sqm: Number(payload.area_sqm ?? payload.area_m2 ?? 84),
      price: Number(payload.price),
      status: payload.status || 'AVAILABLE',
      site_x: payload.site_x ?? 0.5,
      site_y: payload.site_y ?? 0.5,
      description: payload.description || payload.notes || 'Kavling siap bangun',
    };

    const res = await apiRequest('/plots', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    if (res.success && res.data) {
      res.data = normalizePlot(res.data);
    }
    return res;
  }

  async updatePlot(id, payload) {
    const body = { ...payload };
    if (body.code && !body.plot_code) body.plot_code = body.code;
    if (body.area_m2 && !body.area_sqm) body.area_sqm = Number(body.area_m2);
    if (body.price) body.price = Number(body.price);

    const res = await apiRequest(`/plots/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });

    if (res.success && res.data) {
      res.data = normalizePlot(res.data);
    }
    return res;
  }

  // Alias for backward compatibility
  async createLot(payload) {
    return this.createPlot(payload);
  }

  async updateLot(id, payload) {
    return this.updatePlot(id, payload);
  }

  // ==========================================
  // 4. Customers & Leads Service
  // ==========================================
  async getCustomers(filters = {}) {
    const params = new URLSearchParams();
    if (filters.lead_status) params.set('lead_status', filters.lead_status);
    if (filters.search) params.set('search', filters.search);

    const queryStr = params.toString() ? `?${params.toString()}` : '';
    const res = await apiRequest(`/customers${queryStr}`);

    if (res.success && Array.isArray(res.data)) {
      res.data = res.data.map(normalizeCustomer);
    }
    return res;
  }

  async getCustomerById(id) {
    const res = await apiRequest(`/customers/${id}`);
    if (res.success && res.data) {
      res.data = normalizeCustomer(res.data);
    }
    return res;
  }

  async createCustomer(payload) {
    const body = {
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      address: payload.address || '',
      lead_status: payload.lead_status || 'NEW',
      source: payload.source || 'LANDING_PAGE',
      notes: payload.notes || '',
    };

    const res = await apiRequest('/customers', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    if (res.success && res.data) {
      res.data = normalizeCustomer(res.data);
    }
    return res;
  }

  async updateCustomer(id, payload) {
    const res = await apiRequest(`/customers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });

    if (res.success && res.data) {
      res.data = normalizeCustomer(res.data);
    }
    return res;
  }

  async getCustomerActivities(customerId) {
    return await apiRequest(`/customers/${customerId}/activities`);
  }

  async addCustomerActivity(customerId, payload) {
    const body = {
      activity_type: payload.activity_type || 'PHONE_CALL',
      description: payload.description,
      follow_up_at: payload.follow_up_at || null,
    };

    return await apiRequest(`/customers/${customerId}/activities`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  // ==========================================
  // 5. Bookings Service
  // ==========================================
  async getBookings(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.customer_id) params.set('customer_id', filters.customer_id);
    if (filters.plot_id) params.set('plot_id', filters.plot_id);

    const queryStr = params.toString() ? `?${params.toString()}` : '';
    return await apiRequest(`/bookings${queryStr}`);
  }

  async getBookingById(id) {
    return await apiRequest(`/bookings/${id}`);
  }

  async createBooking(payload) {
    const body = {
      customer_id: Number(payload.customer_id),
      plot_id: Number(payload.plot_id),
      booking_fee: Number(payload.booking_fee || 5000000),
      expires_in_days: Number(payload.expires_in_days || 7),
      notes: payload.notes || 'Pengajuan booking kavling',
    };

    return await apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async cancelBooking(id, reason) {
    return await apiRequest(`/bookings/${id}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify({ reason: reason || 'Dibatalkan oleh sistem' }),
    });
  }

  // ==========================================
  // 6. Sales / POS / Transactions Service
  // ==========================================
  async getSales(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.customer_id) params.set('customer_id', filters.customer_id);
    if (filters.plot_id) params.set('plot_id', filters.plot_id);

    const queryStr = params.toString() ? `?${params.toString()}` : '';
    const res = await apiRequest(`/sales${queryStr}`);

    if (res.success && Array.isArray(res.data)) {
      res.data = res.data.map(normalizeSale);
    }
    return res;
  }

  async getSaleById(id) {
    const res = await apiRequest(`/sales/${id}`);
    if (res.success && res.data) {
      res.data = normalizeSale(res.data);
    }
    return res;
  }

  async createSale(payload) {
    const body = {
      customer_id: Number(payload.customer_id),
      plot_id: Number(payload.plot_id),
      booking_id: payload.booking_id ? Number(payload.booking_id) : null,
      discount_amount: Number(payload.discount_amount || 0),
      status: payload.status || 'PENDING_PAYMENT',
      notes: payload.notes || 'Transaksi penjualan via POS',
    };

    const res = await apiRequest('/sales', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    if (res.success && res.data) {
      res.data = normalizeSale(res.data);
    }
    return res;
  }

  async confirmSale(id) {
    const res = await apiRequest(`/sales/${id}/confirm`, {
      method: 'PATCH',
    });
    if (res.success && res.data) {
      res.data = normalizeSale(res.data);
    }
    return res;
  }

  // Aliases for transaction naming
  async getTransactions(filters = {}) {
    return this.getSales(filters);
  }

  async getTransactionById(id) {
    return this.getSaleById(id);
  }

  async createTransaction(payload) {
    return this.createSale(payload);
  }

  // ==========================================
  // 7. Payments Service
  // ==========================================
  async getPayments(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.booking_id) params.set('booking_id', filters.booking_id);
    if (filters.sale_id) params.set('sale_id', filters.sale_id);

    const queryStr = params.toString() ? `?${params.toString()}` : '';
    const res = await apiRequest(`/payments${queryStr}`);

    if (res.success && Array.isArray(res.data)) {
      res.data = res.data.map(normalizePayment);
    }
    return res;
  }

  async getPaymentById(id) {
    const res = await apiRequest(`/payments/${id}`);
    if (res.success && res.data) {
      res.data = normalizePayment(res.data);
    }
    return res;
  }

  async getPaymentsByTransaction(saleId) {
    const res = await this.getPayments({ sale_id: saleId });
    return res;
  }

  async submitPayment(payload) {
    const body = {
      booking_id: payload.booking_id ? Number(payload.booking_id) : null,
      sale_id: payload.sale_id ? Number(payload.sale_id) : null,
      amount: Number(payload.amount),
      method: payload.method || 'BANK_TRANSFER',
      reference_number: payload.reference_number || payload.reference || `REF-${Date.now()}`,
      proof_url: payload.proof_url || null,
      notes: payload.notes || 'Pembayaran kavling',
    };

    const res = await apiRequest('/payments', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    if (res.success && res.data) {
      res.data = normalizePayment(res.data);
    }
    return res;
  }

  async createPayment(payload) {
    return this.submitPayment(payload);
  }

  async verifyPayment(id) {
    const res = await apiRequest(`/payments/${id}/verify`, {
      method: 'PATCH',
    });
    if (res.success && res.data) {
      res.data = normalizePayment(res.data);
    }
    return res;
  }

  async rejectPayment(id, reason) {
    const res = await apiRequest(`/payments/${id}/reject`, {
      method: 'PATCH',
      body: JSON.stringify({ reason: reason || 'Pembayaran ditolak' }),
    });
    if (res.success && res.data) {
      res.data = normalizePayment(res.data);
    }
    return res;
  }

  // ==========================================
  // 8. Dashboard Service
  // ==========================================
  async getDashboardSummary() {
    const res = await apiRequest('/dashboard/summary');
    if (res.success && res.data) {
      const d = res.data;
      // Enrich with backward-compatible top-level keys
      res.data = {
        ...d,
        total_revenue: d.revenue?.total_verified_income ?? d.revenue?.total_sales_revenue ?? 0,
        target_revenue: 1500000000,
        monthly_growth: '+14.2%',
        total_lots: d.plots?.total ?? 0,
        available_lots: d.plots?.available ?? 0,
        sold_lots: d.plots?.sold ?? 0,
        booked_lots: d.plots?.booked ?? 0,
        active_customers: d.counts?.total_customers ?? d.counts?.active_leads ?? 0,
        confirmed_sales: d.counts?.confirmed_sales ?? 0,
      };
    }
    return res;
  }

  async getDashboardLotStatus() {
    return await apiRequest('/dashboard/lot-status');
  }

  async getRecentTransactions(limit = 5) {
    const res = await apiRequest(`/dashboard/recent-transactions?limit=${limit}`);
    if (res.success && Array.isArray(res.data)) {
      res.data = res.data.map(normalizeSale);
    }
    return res;
  }

  // ==========================================
  // 9. Reports Service
  // ==========================================
  async getSalesReport() {
    const res = await apiRequest('/reports/sales');
    if (res.success && Array.isArray(res.data)) {
      res.data = res.data.map(normalizeSale);
    }
    return res;
  }

  async getPaymentsReport() {
    const res = await apiRequest('/reports/payments');
    if (res.success && Array.isArray(res.data)) {
      res.data = res.data.map(normalizePayment);
    }
    return res;
  }

  async getPlotsReport() {
    const res = await apiRequest('/reports/plots');
    if (res.success && Array.isArray(res.data)) {
      res.data = res.data.map(normalizePlot);
    }
    return res;
  }
}

export const api = new ApiAdapter();
export default api;
