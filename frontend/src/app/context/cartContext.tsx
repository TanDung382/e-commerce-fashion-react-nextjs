// src/context/CartContext.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductSize } from '@/app/types/product';

interface CartItem {
  productId: string;
  productName: string;
  price: number;
  discountPrice?: number | null;
  quantity: number;
  sizeValue: string; // Kích thước được chọn
  imageUrl: string | null; // Ảnh thumbnail của sản phẩm
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, sizeValue: string, quantity: number) => void;
  removeFromCart: (productId: string, sizeValue: string) => void;
  updateQuantity: (productId: string, sizeValue: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  // Khởi tạo giỏ hàng từ localStorage (nếu muốn lưu giữa các lần tải lại trang)
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  // Lưu giỏ hàng vào localStorage mỗi khi cart thay đổi
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (product: Product, sizeValue: string, quantity: number) => {
    const size = product.sizes.find((s) => s.size_value === sizeValue);
    if (!size || size.stock < quantity) {
      alert('Kích thước này không có sẵn hoặc không đủ hàng.');
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.productId === product.id && item.sizeValue === sizeValue
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.productId === product.id && item.sizeValue === sizeValue
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      const thumbnail = product.images.find((img) => img.is_thumbnail)?.image_url || product.images[0]?.image_url;

      return [
        ...prevCart,
        {
          productId: product.id,
          productName: product.name,
          price: product.price,
          discountPrice: product.discount_price,
          quantity,
          sizeValue,
          imageUrl: thumbnail || null,
        },
      ];
    });
  };

  const removeFromCart = (productId: string, sizeValue: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.productId === productId && item.sizeValue === sizeValue))
    );
  };

  const updateQuantity = (productId: string, sizeValue: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, sizeValue);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId && item.sizeValue === sizeValue
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.discountPrice || item.price;
      return total + price * item.quantity;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};