// src/app/utils/orderApi.ts
import { AxiosResponse } from 'axios';
import api from './api';

interface OrderAddress {
  full_address_line: string;
  house_number?: string;
  street_name?: string;
  neighborhood?: string;
  ward?: string;
  city?: string;
  country?: string;
  recipient_name: string;
  recipient_phone: string;
}

interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
  size_value: string;
  product_name: string;
  product_image?: string;
}

interface CreateOrderRequest {
  user_id: string;
  order_address: OrderAddress;
  items: OrderItem[];
  payment_method: 'cash' | 'momo' | 'zalopay' | 'bank';
  note?: string;
}

interface CreateOrderResponse {
  order_id: string;
  payment_url?: string; // Nếu dùng thanh toán online như momo/zalopay
}

const orderApi = {
  create: async (data: CreateOrderRequest): Promise<CreateOrderResponse> => {
    const response: AxiosResponse<CreateOrderResponse> = await api.post('/api/orders', data);
    return response.data;
  },
};

export default orderApi;