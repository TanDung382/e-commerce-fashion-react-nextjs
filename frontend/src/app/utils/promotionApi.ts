import api from './api';
import { Promotion, NewPromotion, UpdatePromotion } from '../types/product';
import { AxiosResponse } from 'axios';

const promotionApi = {
  getAll: async (): Promise<AxiosResponse<Promotion[]>> => {
    const response: AxiosResponse<Promotion[]> = await api.get('/api/promotion');
    return response;
  },
  
  create: async (data: NewPromotion): Promise<string | null> => {
    const response: AxiosResponse<{ id: string }> = await api.post('/api/promotion', data);
    return response.data.id || null;
  },
  
  update: async (id: string, data: UpdatePromotion): Promise<boolean> => {
    const response: AxiosResponse = await api.put(`/api/promotion/${id}`, data);
    return response.status === 200;
  },
  
  delete: async (id: string): Promise<boolean> => {
    const response: AxiosResponse = await api.delete(`/api/promotion/${id}`);
    return response.status === 200;
  },   
};

export default promotionApi;