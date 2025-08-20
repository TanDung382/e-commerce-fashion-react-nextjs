// src/app/types/order.ts
export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'CANCELLED';
export type PaymentMethod = 'cash' | 'momo' | 'zalopay' | 'bank';

export interface OrderAddress {
  id: string;
  full_address_line: string;
  house_number?: string | null;
  street_name?: string | null;
  neighborhood?: string | null;
  ward?: string | null;
  city?: string | null;
  country?: string;
  recipient_name: string;
  recipient_phone: string;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  size_id?: number | null;
  size_value?: string | null;
  product_name?: string | null;
  product_image?: string | null;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface Order {
  id: string;
  user_id: string;
  order_address_id: string;
  total_amount: number;
  status: OrderStatus;
  payment_method: PaymentMethod | null;
  note?: string | null;
  created_at: Date | string;
  updated_at: Date | string;
  items?: OrderItem[];
  address?: OrderAddress;
}