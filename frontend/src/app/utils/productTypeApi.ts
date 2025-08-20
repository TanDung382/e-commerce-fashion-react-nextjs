import api from './api';
import { ProductType, NewProductType, UpdateProductType } from '../types/product';
import { AxiosResponse } from 'axios';

const productTypeApi = { 
  getAll: async (): Promise<AxiosResponse<ProductType[]>> => {
    const response: AxiosResponse<ProductType[]> = await api.get('/api/productType');
    return response;
  },
  
  create: async (data: NewProductType): Promise<string | null> => {
    const response: AxiosResponse<{ id: string }> = await api.post('/api/productType', data);
    return response.data.id || null;
  },
  
  update: async (id: string, data: UpdateProductType): Promise<boolean> => {
    const response: AxiosResponse = await api.put(`/api/productType/${id}`, data);
    return response.status === 200;
  },
  
  delete: async (id: string): Promise<boolean> => {
    const response: AxiosResponse = await api.delete(`/api/productType/${id}`);
    return response.status === 200;
  },   
};

export default productTypeApi;