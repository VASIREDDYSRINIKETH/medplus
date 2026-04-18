import axios from 'axios';
import type { Medicine, SellPayload } from '../types';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach JWT
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export const medicineApi = {
  getAll: async (): Promise<Medicine[]> => {
    const { data } = await api.get<Medicine[]>('/medicines');
    return data;
  },

  create: async (medicine: Omit<Medicine, 'id'>): Promise<Medicine> => {
    const { data } = await api.post<Medicine>('/medicines', medicine);
    return data;
  },

  sell: async (id: number, payload: SellPayload): Promise<Medicine> => {
    const { data } = await api.put<Medicine>(`/sell/${id}`, payload);
    return data;
  },

  search: async (query: string): Promise<Medicine[]> => {
    const { data } = await api.get<Medicine[]>('/search', {
      params: { q: query },
    });
    return data;
  },
};

export default api;
