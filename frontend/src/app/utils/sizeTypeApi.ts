import api from './api';
import { SizeType, NewSizeType, UpdateSizeType } from '../types/product';
import { AxiosResponse } from 'axios';

const sizeTypeApi = { 
  getAll: async (): Promise<AxiosResponse<SizeType[]>> => {
    const response: AxiosResponse<SizeType[]> = await api.get('/api/sizeType');
    return response;
  },
  
  create: async (data: NewSizeType): Promise<string | null> => {
    const response: AxiosResponse<{ id: string }> = await api.post('/api/sizeType', data);
    return response.data.id || null;
  },
  
  update: async (id: string, data: UpdateSizeType): Promise<boolean> => {
    const response: AxiosResponse = await api.put(`/api/sizeType/${id}`, data);
    return response.status === 200;
  },
  
  delete: async (id: string): Promise<boolean> => {
    const response: AxiosResponse = await api.delete(`/api/sizeType/${id}`);
    return response.status === 200;
  },       
};

export default sizeTypeApi;