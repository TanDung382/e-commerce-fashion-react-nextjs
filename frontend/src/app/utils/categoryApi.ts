import api from './api';
import { Category, NewCategory, UpdateCategory } from '../types/product';
import { AxiosResponse } from 'axios';

const categoryApi = {
  getAll: async (): Promise<AxiosResponse<Category[]>> => {
    const response: AxiosResponse<{ success: boolean; message: string; data: Category[] }> = await api.get('/api/categories');
    const categories = response.data.data; // Truy cập mảng danh mục
    if (!Array.isArray(categories)) {
      return {
        ...response,
        data: [],
        status: 200,
        statusText: 'OK',
        headers: response.headers,
        config: response.config,
      };
    }
    return { ...response, data: categories };
  },
  
  create: async (data: NewCategory): Promise<string | null> => {
    const response: AxiosResponse<{ id: string }> = await api.post('/api/categories', data);
    return response.data.id || null;
  },
  
  update: async (id: string, data: UpdateCategory): Promise<boolean> => {
    const response: AxiosResponse = await api.put(`/api/categories/${id}`, data);
    return response.status === 200;
  },
  
  delete: async (id: string): Promise<boolean> => {
    const response: AxiosResponse = await api.delete(`/api/categories/${id}`);
    return response.status === 200;
  },
};

export default categoryApi;