'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { CartProvider } from '@/app/context/cartContext';
import ProtectedLayout from '@/app/(protected)/layout'; // Sửa import

export default function PublicLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Chỉ áp dụng ProtectedLayout cho /profile và /checkout
  const protectedPaths = ['/profile', '/checkout'];

  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#99FEFF]/10 to-[#B983FF]/10">
        <Header />
        <main className="flex-grow">
          {protectedPaths.includes(pathname) ? (
            <ProtectedLayout requireAdmin={false}>{children}</ProtectedLayout>
          ) : (
            children
          )}
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}