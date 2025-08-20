'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../utils/api';
import { useRouter } from 'next/navigation';
import { User } from '../types/auth';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string, redirectTo?: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<any>;
  logout: () => void;
  isLoading: boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      verifyStoredToken(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyStoredToken = async (storedToken: string) => {
    try {
      const response = await api.post('/api/auth/verify-token', { token: storedToken });
      if (response.data.isValid) {
        setUser({
          id: response.data.userId,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
        });
      } else {
        logout();
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }
    } catch (error) {
      logout();
      toast.error('Phiên đăng nhập không hợp lệ.');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, redirectTo?: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token, user: userData } = response.data;
      setToken(token);
      setUser(userData);
      localStorage.setItem('token', token);
      const redirectPath = redirectTo || localStorage.getItem('redirectAfterLogin') || '/';
      localStorage.removeItem('redirectAfterLogin');
      router.push(redirectPath);
      toast.success('Đăng nhập thành công!');
    } catch (error: any) {
      console.error('Đăng nhập thất bại:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        throw new Error('Email hoặc mật khẩu không đúng.');
      } else if (error.response?.status === 429) {
        throw new Error('Quá nhiều yêu cầu. Vui lòng thử lại sau.');
      }
      throw new Error(error.response?.data?.message || 'Đăng nhập thất bại.');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: string = 'user') => {
    setIsLoading(true);
    try {
      const response = await api.post('/api/auth/register', { name, email, password, role });
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 409) {
        throw new Error('Email đã được sử dụng.');
      }
      throw new Error(error.response?.data?.message || 'Đăng ký thất bại.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('redirectAfterLogin');
    router.push('/');
    toast.success('Đăng xuất thành công!');
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};