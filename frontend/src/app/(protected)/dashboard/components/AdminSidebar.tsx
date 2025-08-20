"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 
import {
  LayoutDashboardIcon,
  PackageIcon,
  TagIcon,
  RulerIcon,
  PercentIcon,
  MenuIcon,
  ListTree,
  PencilRuler,
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isOpen,
  toggleSidebar,
}) => {
  const pathname = usePathname(); 

  const navItems = [
    {
      path: '/dashboard', 
      label: 'Dashboard',
      icon: LayoutDashboardIcon,
    },
    {
      path: '/dashboard/products', 
      label: 'Sản phẩm',
      icon: PackageIcon,
    },
    {
      path: '/dashboard/product-types', 
      label: 'Loại sản phẩm',
      icon: TagIcon,
    },
    {
      path: '/dashboard/categories', 
      label: 'Danh mục',
      icon: ListTree,
    },
    {
      path: '/dashboard/size-types', 
      label: 'Loại kích cỡ',
      icon: PencilRuler,
    },
    {
      path: '/dashboard/sizes', 
      label: 'Kích cỡ',
      icon: RulerIcon,
    },
    {
      path: '/dashboard/promotions', 
      label: 'Khuyến mãi',
      icon: PercentIcon,
    },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 bg-white border-r border-[#94DAFF]/20 z-30 transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-[#94DAFF]/20">
        <Link href="/dashboard" className="flex items-center">
          {isOpen ? (
            <h1 className="text-xl font-bold text-[#B983FF]">ZZ Admin</h1>
          ) : (
            <h1 className="text-xl font-bold text-[#B983FF]">ZZ</h1>
          )}
        </Link>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-[#94B3FD] hover:bg-[#94DAFF]/10 hover:text-[#B983FF]"
        >
          <MenuIcon size={20} />
        </button>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`flex items-center py-3 px-4 rounded-lg transition-colors ${pathname === item.path ? 'bg-[#B983FF] text-white' : 'text-[#94B3FD] hover:bg-[#94DAFF]/10 hover:text-[#B983FF]'}`}
              >
                <item.icon size={20} className="flex-shrink-0" />
                {isOpen && <span className="ml-3">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {/* Nút "Back to Site" */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <Link
          href="/" // Đường dẫn trở về trang chủ của người dùng
          className="flex items-center py-3 px-4 rounded-lg text-[#94B3FD] hover:bg-[#94DAFF]/10 hover:text-[#B983FF] transition-colors"
        >
          {/* Icon mũi tên quay lại */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          {isOpen && <span className="ml-3">Back to Site</span>}
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;