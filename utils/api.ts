
import axios from 'axios';
import { parseCookies } from 'nookies';
import { ApiCard, ApiPurchase, Pagination } from './apiTypes';

// Cria uma instância base do axios
const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const cookies = parseCookies();
    const token = cookies['next-auth.session-token'];
    
    if (token && config.headers) {
      config.headers.set('Cookie', `next-auth.session-token=${token}`);
    }
  }
  
  return config;
});

export async function createPurchase(data: any) {
  return api.post('/purchase', data);
}


export async function getPurchases({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
}) {
  const result = await api.get<Pagination<ApiPurchase>>('/purchase', {
    params: { page, limit }
  })
  
  return result;  
}


export async function getCards (query: string) {
  
  return api.get<ApiCard[]>(`/cards?name=${query}`)
}


export default api;