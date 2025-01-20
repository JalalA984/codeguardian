  // src/services/api.ts
  import axios from 'axios';
  import { API_URL } from '../config';
  
  const api = axios.create({
    baseURL: API_URL,
  });
  
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  
  export const submitCode = async (code: string, language: string) => {
    const response = await api.post('/api/code/submit', { code, language });
    return response.data;
  };