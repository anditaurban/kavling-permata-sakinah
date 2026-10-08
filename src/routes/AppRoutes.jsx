import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../components/layout/PublicLayout';
import AdminLayout from '../components/layout/AdminLayout';
import CustomerLayout from '../components/layout/CustomerLayout';

// Public Pages
import HomePage from '../pages/public/HomePage';
import ProjectsPage from '../pages/public/ProjectsPage';
import ProjectDetailPage from '../pages/public/ProjectDetailPage';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';

// Internal Pages
import DashboardPage from '../pages/internal/DashboardPage';
import PosPage from '../pages/internal/PosPage';
import ProjectsManagementPage from '../pages/internal/ProjectsManagementPage';
import LotsManagementPage from '../pages/internal/LotsManagementPage';
import CustomersManagementPage from '../pages/internal/CustomersManagementPage';
import TransactionsManagementPage from '../pages/internal/TransactionsManagementPage';
import PaymentsManagementPage from '../pages/internal/PaymentsManagementPage';
import ReportsPage from '../pages/internal/ReportsPage';
import UsersManagementPage from '../pages/internal/UsersManagementPage';

// Customer Pages
import CustomerDashboardPage from '../pages/customer/CustomerDashboardPage';
import CustomerLotsPage from '../pages/customer/CustomerLotsPage';
import CustomerPaymentsPage from '../pages/customer/CustomerPaymentsPage';
import CustomerProfilePage from '../pages/customer/CustomerProfilePage';

// Not Found
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Internal Management (Owner, Admin, Staff) */}
      <Route element={<AdminLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/pos" element={<PosPage />} />
        <Route path="/admin/projects" element={<ProjectsManagementPage />} />
        <Route path="/admin/lots" element={<LotsManagementPage />} />
        <Route path="/admin/customers" element={<CustomersManagementPage />} />
        <Route path="/admin/transactions" element={<TransactionsManagementPage />} />
        <Route path="/admin/payments" element={<PaymentsManagementPage />} />
        <Route path="/admin/reports" element={<ReportsPage />} />
        <Route path="/admin/users" element={<UsersManagementPage />} />
      </Route>

      {/* Customer Portal */}
      <Route path="/customer" element={<CustomerLayout />}>
        <Route index element={<CustomerDashboardPage />} />
        <Route path="lots" element={<CustomerLotsPage />} />
        <Route path="payments" element={<CustomerPaymentsPage />} />
        <Route path="profile" element={<CustomerProfilePage />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<PublicLayout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
