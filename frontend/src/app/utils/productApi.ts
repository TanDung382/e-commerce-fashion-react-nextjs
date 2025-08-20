import { AxiosResponse } from 'axios';
import api from './api';
import { Product, NewProduct, UpdateProduct } from '../types/product';

const productApi = {

  getAll: async (): Promise<AxiosResponse<Product[]>> => {
    const response: AxiosResponse<Product[]> = await api.get('/api/products'); // Sửa endpoint
    return response;
  },
  
  getByCategorySlug: async (slug: string): Promise<AxiosResponse<Product[]>> => {
    const response: AxiosResponse<{ success: boolean; message: string; data: Product[] }> = await api.get(`/api/categories/${slug}`);
    const products = response.data.data;
    if (!Array.isArray(products)) {
      console.warn(`Dữ liệu sản phẩm không hợp lệ, trả về mảng rỗng: ${JSON.stringify(products)}`);
      return {
        ...response,
        data: [],
        status: 200,
        statusText: 'OK',
        headers: response.headers,
        config: response.config,
      };
    }
    return { ...response, data: products };
  },
    
  getProductByCategory: async (slug: string): Promise<AxiosResponse<Product[]>> => {
    const response: AxiosResponse<{ success: boolean; message: string; data: Product[] }> = await api.get(`/api/products/category/${slug}`);
    const products = response.data.data;
    if (!Array.isArray(products)) {
      console.warn(`Dữ liệu sản phẩm không hợp lệ, trả về mảng rỗng: ${JSON.stringify(products)}`);
      return {
        ...response,
        data: [],
        status: 200,
        statusText: 'OK',
        headers: response.headers,
        config: response.config,
      };
    }
    return { ...response, data: products };
  },

  getBestSellers: async (): Promise<AxiosResponse<Product[]>> => {
    const response: AxiosResponse<Product[]> = await api.get('/api/products/best-sellers');
    return response; 
  },

  getById: async (id: string): Promise<AxiosResponse<Product>> => {
    try {
      const response: AxiosResponse<{ data: Product; message: string; status: number }> = await api.get(`/api/products/${id}`);
      console.log('Yêu cầu API getById:', `${api.defaults.baseURL}/api/products/${id}`);
      console.log('Phản hồi API getById:', response.data);
      if (response.data.status === 404) {
        throw new Error('Product not found');
      }
      return {
        ...response,
        data: response.data.data,
      };
    } catch (error: any) {
      console.error('Lỗi khi lấy sản phẩm theo ID:', error);
      throw error;
    }
  },

  create: async (data: NewProduct): Promise<string | null> => {
    const response: AxiosResponse<{ id: string }> = await api.post('/api/products', data);
    return response.data.id;
  },

  update: async (id: string, data: UpdateProduct): Promise<boolean> => {
    try {
      const response: AxiosResponse = await api.put(`/api/products/${id}`, data);
      return response.status === 200;
    } catch (error: any) {
      console.error('Update Product Error:', JSON.stringify(error.response?.data || error, null, 2));
      throw error;
    }
  },

  delete: async (id: string): Promise<boolean> => {
    const response: AxiosResponse = await api.delete(`/api/products/${id}`);
    return response.status === 200;
  },
};

export default productApi;