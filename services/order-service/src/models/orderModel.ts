// services/order-service/src/models/orderModel.ts

export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'CANCELLED';
export type PaymentMethod = 'cash' | 'momo' | 'zalopay' | 'bank';

export interface OrderAddress {
  id: string; // UUID
  full_address_line: string;
  house_number?: string | null;
  street_name?: string | null;
  neighborhood?: string | null;
  ward?: string | null;
  city?: string | null;
  country?: string;
  recipient_name: string;
  recipient_phone: string;
  created_at: Date;
  updated_at: Date;
}

export interface OrderItem {
  id: string; // UUID
  order_id: string; // UUID
  product_id: string; // UUID
  quantity: number;
  price: number;
  size_id?: number | null;
  size_value?: string | null;
  product_name?: string | null;
  product_image?: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Order {
  id: string; // UUID
  user_id: string; // UUID
  order_address_id: string; // UUID
  total_amount: number;
  status: OrderStatus;
  payment_method: PaymentMethod | null;
  note?: string | null;
  created_at: Date;
  updated_at: Date;
  items?: OrderItem[];
  address?: OrderAddress;
}

export interface NewOrder {
  user_id: string; // UUID
  order_address: {
    full_address_line: string;
    house_number?: string | null;
    street_name?: string | null;
    neighborhood?: string | null;
    ward?: string | null;
    city?: string | null;
    country?: string;
    recipient_name: string;
    recipient_phone: string;
  };
  items: {
    product_id: string;
    quantity: number;
    price: number;
    size_value: string;
    product_name: string;
    product_image?: string | null;
  }[];
  payment_method: PaymentMethod;
  note?: string | null;
}

export interface PaymentInfo {
  id: string; // UUID
  order_id: string; // UUID
  transaction_id: string;
  secure_code?: string | null;
  raw_response?: string | null;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  created_at: Date;
  updated_at: Date;
}