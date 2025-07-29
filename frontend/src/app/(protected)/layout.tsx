'use client'; 

import { useEffect, ReactNode } from 'react';
import { useAuth } from '../components/AuthProvider';
import { useRouter } from 'next/navigation';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      // Nếu không còn loading và user là null (chưa đăng nhập), chuyển hướng
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div>Đang tải...</div>; 
  }

  if (!user) {
    return null; 
  }

  return <>{children}</>;
}