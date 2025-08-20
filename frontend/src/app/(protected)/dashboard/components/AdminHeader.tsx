"use client"; // Bắt buộc phải có dòng này vì sử dụng useState

import React, { useState } from 'react';
import { BellIcon, UserIcon, LogOutIcon, SettingsIcon, MenuIcon } from 'lucide-react'; // Thêm MenuIcon nếu muốn dùng để toggle sidebar
import Link from 'next/link';
import { useAuth } from '../../../context/AuthProvider';

interface AdminHeaderProps {
  toggleSidebar: () => void; // Prop để gọi hàm toggleSidebar từ layout
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ toggleSidebar }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout, isLoading } = useAuth();

  if (!user) {
    return null; 
  }

  return (
    <header className="bg-white border-b border-[#94DAFF]/20 h-16 flex items-center justify-between px-6">
      <div className="flex items-center">
        <h2 className="text-[#B983FF] font-medium">Admin Dashboard</h2>
      </div>
      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <button className="p-2 rounded-full text-[#94B3FD] hover:bg-[#94DAFF]/10 hover:text-[#B983FF] relative">
          <BellIcon size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        {/* User Menu Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 rounded-full bg-[#B983FF] flex items-center justify-center text-white">
              <UserIcon size={16} />
            </div>
            <span className="text-[#94B3FD] hidden md:block">Admin User</span>
          </button>
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#94DAFF]/20 z-10">
              <div className="p-3 border-b border-[#94DAFF]/20">
                <p className="font-medium text-[#B983FF]">Admin User</p>
                <p className="text-[#94B3FD] text-sm">Xin chào, {user.name}</p>
              </div>
              <ul>
                <li>
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-2 text-[#94B3FD] hover:bg-[#94DAFF]/10 hover:text-[#B983FF]"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <UserIcon size={16} className="mr-2" />
                    Hồ sơ
                  </Link>
                </li>
                {/* <li>
                  <Link
                    href="/settings"
                    className="flex items-center px-4 py-2 text-[#94B3FD] hover:bg-[#94DAFF]/10 hover:text-[#B983FF]"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <SettingsIcon size={16} className="mr-2" />
                    Settings
                  </Link>
                </li> */}
                <li className="border-t border-[#94DAFF]/20">
                  <Link
                    href="/login"
                    className="flex items-center px-4 py-2 text-red-500 hover:bg-red-50"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <LogOutIcon size={16} className="mr-2" />
                    Đăng Xuất
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;