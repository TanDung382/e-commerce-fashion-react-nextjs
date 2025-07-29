'use client';

import React, { useState } from 'react';
import { useAuth } from '../../components/AuthProvider';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeOffIcon } from 'lucide-react'

const RegisterPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');  
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { register, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name || !email || !password || !confirmPassword) {
      setError('Vui lòng điền đầy đủ tất cả các trường.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    if (password.length < 6) {
        setError('Mật khẩu phải có ít nhất 6 ký tự.');
        return;
    }

    try {
      await register(name, email, password);
      router.push('/login');
    } catch (err: any) {
      console.error('Registration failed:', err);
      setError(err.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center 
    bg-gradient-to-b from-[#e9eef4] to-[#e8edf4] text-black p-8 px-4 sm:px-8 pt-5 pb-24">
      <div className="w-full max-w-md bg-gradient-to-r from-[#B983FF] to-[#94DAFF] p-6 
      text-white rounded-t-xl shadow-lg overflow-hidden">
        <h1 className="text-2xl font-bold text-center">Tạo tài khoản</h1>
      </div>
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-b-xl shadow-lg overflow-hidden px-6 py-6">
        <div className="pb-5">
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-[#374151] mb-2"
          >
            Tên
          </label>
          <input
            id="fullName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-white text-[#374151] 
            leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Tên"
          />
        </div>
        <div className="pb-5">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[#374151] mb-2"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-white text-[#374151] 
            leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Email"
          />
        </div>
        <div className="pb-5">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-[#374151] mb-2"
          >
            Mật khẩu
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
        <div className="pb-5">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-[#374151] mb-2"
          >
            Xác nhận mật khẩu
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-white text-[#374151] 
            leading-tight focus:outline-none focus:shadow-outline "
              placeholder="Xác nhận mật khẩu"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOffIcon size={18} />
              ) : (
                <EyeIcon size={18} />
              )}
            </button>
          </div>
        </div>
        <div className="pt-2 mb-4">
          <button
            type="submit"
            className={`w-full py-2 px-4 bg-gradient-to-r from-[#B983FF] to-[#94B3FD] text-white 
              rounded-lg hover:opacity-90 transition-opacity${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Đang đăng ký...' : 'Đăng Ký'}
          </button>
        </div>
        <div className="text-center text-sm text-gray-600">
          Đã có tài khoản?{' '}
          <Link
            href="/login"
            className="font-medium text-[#B983FF] hover:text-[#94B3FD]"
          >
            Đăng nhập
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;