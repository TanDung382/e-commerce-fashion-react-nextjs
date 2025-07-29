'use client';

import React, { useState } from 'react';
import { useAuth } from '../../components/AuthProvider';
import Link from 'next/link';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err || 'Đăng nhập thất bại.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center 
    bg-gradient-to-b from-[#e9eef4] to-[#e8edf4] text-black p-8 px-4 py-16 sm:px-8 pt-5 pb-24">
      <div className="w-full max-w-md bg-gradient-to-r from-[#B983FF] to-[#94DAFF] p-6 text-white 
      rounded-t-xl shadow-lg overflow-hidden">
        <h1 className="text-2xl font-bold text-center">Đăng nhập</h1>
      </div>
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-b-xl shadow-lg overflow-hidden px-6 py-6">
        <div className="pb-7">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[#374151] mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-white text-[#374151] 
            leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Tên tài khoản"
          />
        </div>
        <div className="pb-5">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-[#374151] mb-2"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-white text-[#374151] 
              leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Mật khẩu"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {/* <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="h-4 w-4 accent-[#B983FF]  text-[#B983FF] focus:ring-[#B983FF] border-gray-300 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-[#374151]"
            >
              Remember me
            </label> */}
          </div>
          <div className="text-sm">
            <a
              href="#"
              className="font-medium text-[#B983FF] hover:text-[#94B3FD]"
            >
              Quên mật khẩu?
            </a>
          </div>
        </div>
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 bg-gradient-to-r from-[#B983FF] to-[#94B3FD] text-white 
              rounded-lg hover:opacity-90 transition-opacity mb-7 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
          {isLoading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
        </button>
        </div>
        <div className="text-center text-sm text-gray-600">
          Chưa có tài khoản?{' '}
          <Link
            href="/register"
            className="font-medium text-[#B983FF] hover:text-[#94B3FD]"
          >
            Đăng ký ngay
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;