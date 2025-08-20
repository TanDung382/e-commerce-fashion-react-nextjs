'use client'

import React, { useState } from 'react';
import AdminHeader from './components/AdminHeader';
import AdminSidebar from './components/AdminSidebar';
import ProtectedLayout from '../layout';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ProtectedLayout requireAdmin={true}>
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
          <AdminHeader toggleSidebar={toggleSidebar} />
          <main className="flex-1 p-6 overflow-y-auto">
            {children} 
          </main>
        </div>
      </div>
    </ProtectedLayout>
  );
}