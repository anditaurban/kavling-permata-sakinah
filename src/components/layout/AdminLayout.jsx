import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { role, isAuthenticated } = useAuth();
  const location = useLocation();

  // If Guest (not authenticated), block and redirect to login
  if (!isAuthenticated || role === 'GUEST') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If customer accesses internal admin layout, route them to Customer Portal
  if (role === 'CUSTOMER') {
    return <Navigate to="/customer" replace />;
  }

  // Only OWNER, ADMIN, STAFF allowed in AdminLayout
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:pl-64">
      {/* Sidebar navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
