// Nội dung cho sizeApi.ts

import api from './api';
import { Size, NewSize, UpdateSize, SizeType } from '../types/product';
import { AxiosResponse } from 'axios';

const sizeApi = {
  
  getAll: async (): Promise<AxiosResponse<Size[]>> => {
    const response: AxiosResponse<Size[]> = await api.get('/api/size'); 
    return response;
  },

  create: async (data: NewSize): Promise<number | null> => {
    const response: AxiosResponse<{ id: number }> = await api.post('/api/size', data);
    return response.data.id || null;
  },

  update: async (id: number, data: UpdateSize): Promise<boolean> => {
    const response: AxiosResponse = await api.put(`/api/size/${id}`, data);
    return response.status === 200;
  },

  delete: async (id: number): Promise<boolean> => {
    const response: AxiosResponse = await api.delete(`/api/size/${id}`);
    return response.status === 200;
  },

  getAllSizeTypes: async (): Promise<AxiosResponse<SizeType[]>> => {
    const response: AxiosResponse<AxiosResponse<SizeType[]>> = await api.get('/api/sizeType');
    return response.data;
  },
};

export default sizeApi;