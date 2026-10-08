import {
  MOCK_USERS,
  MOCK_PROJECTS,
  MOCK_LOTS,
  MOCK_CUSTOMERS,
  MOCK_TRANSACTIONS,
  MOCK_PAYMENTS,
  MOCK_DASHBOARD_SUMMARY,
} from './mockData';

// Simulated delay to emulate real async network calls
const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

class MockApiAdapter {
  // --- Auth Service ---
  async login(email, password) {
    await delay();
    const user = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      return { success: true, data: { user, token: 'mock-jwt-token-' + user.role } };
    }
    return {
      success: false,
      error: { code: 'AUTH_FAILED', message: 'Email atau kata sandi tidak valid' },
    };
  }

  async getMe(role = 'ADMIN') {
    await delay();
    const user = MOCK_USERS.find((u) => u.role === role) || MOCK_USERS[1];
    return { success: true, data: user };
  }

  async logout() {
    await delay();
    return { success: true, data: null };
  }

  // --- Projects Service ---
  async getProjects() {
    await delay();
    return { success: true, data: [...MOCK_PROJECTS] };
  }

  async getProjectById(id) {
    await delay();
    const project = MOCK_PROJECTS.find((p) => p.id === id || p.slug === id);
    if (!project) {
      return { success: false, error: { code: 'NOT_FOUND', message: 'Project tidak ditemukan' } };
    }
    return { success: true, data: project };
  }

  // --- Lots Service ---
  async getLots(projectId, filters = {}) {
    await delay();
    let lots = [...MOCK_LOTS];
    if (projectId) {
      lots = lots.filter((l) => l.project_id === projectId);
    }
    if (filters.status) {
      lots = lots.filter((l) => l.status === filters.status);
    }
    if (filters.block) {
      lots = lots.filter((l) => l.block === filters.block);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      lots = lots.filter((l) => l.code.toLowerCase().includes(q));
    }
    return { success: true, data: lots, meta: { total: lots.length } };
  }

  async getLotById(id) {
    await delay();
    const lot = MOCK_LOTS.find((l) => l.id === id);
    if (!lot) {
      return { success: false, error: { code: 'NOT_FOUND', message: 'Kavling tidak ditemukan' } };
    }
    return { success: true, data: lot };
  }

  // --- Customers Service ---
  async getCustomers() {
    await delay();
    return { success: true, data: [...MOCK_CUSTOMERS] };
  }

  async getCustomerById(id) {
    await delay();
    const customer = MOCK_CUSTOMERS.find((c) => c.id === id);
    if (!customer) {
      return { success: false, error: { code: 'NOT_FOUND', message: 'Customer tidak ditemukan' } };
    }
    return { success: true, data: customer };
  }

  async createCustomer(payload) {
    await delay();
    const newCustomer = {
      id: `cus_${Date.now()}`,
      status: 'ACTIVE',
      ...payload,
    };
    return { success: true, data: newCustomer };
  }

  // --- Transactions Service ---
  async getTransactions() {
    await delay();
    return { success: true, data: [...MOCK_TRANSACTIONS] };
  }

  async getTransactionById(id) {
    await delay();
    const trx = MOCK_TRANSACTIONS.find((t) => t.id === id);
    if (!trx) {
      return { success: false, error: { code: 'NOT_FOUND', message: 'Transaksi tidak ditemukan' } };
    }
    return { success: true, data: trx };
  }

  async createTransaction(payload) {
    await delay();
    const newTrx = {
      id: `trx_${Date.now()}`,
      transaction_number: `TRX-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      created_at: new Date().toISOString(),
      status: 'ACTIVE',
      ...payload,
    };
    return { success: true, data: newTrx };
  }

  // --- Payments Service ---
  async getPayments() {
    await delay();
    return { success: true, data: [...MOCK_PAYMENTS] };
  }

  async getPaymentsByTransaction(transactionId) {
    await delay();
    const payments = MOCK_PAYMENTS.filter((p) => p.transaction_id === transactionId);
    return { success: true, data: payments };
  }

  // --- Dashboard Service ---
  async getDashboardSummary() {
    await delay();
    return { success: true, data: MOCK_DASHBOARD_SUMMARY };
  }

  async getRecentTransactions() {
    await delay();
    return { success: true, data: MOCK_TRANSACTIONS.slice(0, 5) };
  }
}

export const api = new MockApiAdapter();
export default api;
