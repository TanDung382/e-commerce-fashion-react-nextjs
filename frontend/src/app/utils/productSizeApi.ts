// Nội dung cho productSizeApi.ts

import api from './api';
import { ProductSize, NewProductSize, UpdateProductSize } from '../types/product';
import { AxiosResponse } from 'axios';

const productSizeApi = {

  getAll: async (): Promise<AxiosResponse<ProductSize[]>> => {
    const response: AxiosResponse<ProductSize[]> = await api.get('/api/productSize'); // Sửa endpoint
    return response;
  },

  create: async (data: NewProductSize): Promise<string | null> => {
    const response: AxiosResponse<{ id: string }> = await api.post('/api/productSize', data);
    return response.data.id || null;
  },

  update: async (id: string, data: UpdateProductSize): Promise<boolean> => {
    const response: AxiosResponse = await api.put(`/api/productSize/${id}`, data);
    return response.status === 200;
  },

  delete: async (id: string): Promise<boolean> => {
    const response: AxiosResponse = await api.delete(`/api/productSize/${id}`);
    return response.status === 200;
  },
};

export default productSizeApi;