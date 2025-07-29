'use client';

import Link from 'next/link';
import { SearchIcon, UserIcon, ShoppingCartIcon } from 'lucide-react'
import { useAuth } from './AuthProvider'; 
import { useState } from 'react';

const Header = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-[#B983FF] to-[#94DAFF] p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-white">
          ZZ_2hand
        </Link>
        {/* Search Bar */}
        <div className="flex-grow max-w-md mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm"
              className="w-full px-4 py-2 rounded-full focus:outline-none focus:ring-2 bg-white focus:ring-[#B983FF] 
              text-black"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#94B3FD]">
              <SearchIcon size={20} />
            </button>
          </div>
        </div>
        {/* Cart and User */}
        <div className="flex items-center space-x-4 text-white">
          <button className="hover:text-[#99FEFF] transition-colors relative">
            <ShoppingCartIcon size={24} />
            <span className="absolute -top-2 -right-2 bg-[#B983FF] text-white text-xs 
            rounded-full w-5 h-5 flex items-center justify-center">
              
            </span>
          </button>
          <div className="relative">
            <button
              className="hover:text-[#99FEFF] transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <UserIcon size={24} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-50 text-black">
                {!user ? (
                  <div className="flex flex-col p-2">
                    <Link
                      href="/register"
                      className="text-gray-700  px-4 py-2 hover:bg-gray-100 rounded"
                      onClick={() => setMenuOpen(false)}
                    >
                      Đăng Ký
                    </Link>
                    <Link
                      href="/login"
                      className="text-gray-700 px-4 py-2 hover:bg-gray-100 rounded"
                      onClick={() => setMenuOpen(false)}
                    >
                      Đăng Nhập
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col p-2">                      
                    <Link
                      href="/profile"
                      className="text-black-700 px-4 py-2 hover:bg-gray-100 rounded"
                      onClick={() => setMenuOpen(false)}
                    >
                      Hồ Sơ
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                      }}
                      className="text-red-600 px-4 py-2 hover:bg-red-100 rounded text-left"
                    >
                      Đăng Xuất
                    </button>
                  </div>
                )}
              </div>
            )}            
          </div>          
        </div>
      </div>
    </nav>
  );
};

export default Header;