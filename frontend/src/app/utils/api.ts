import axios from 'axios';

const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_GATEWAY_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để đính kèm token vào mọi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;