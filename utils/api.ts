
import axios from 'axios';
import { parseCookies } from 'nookies';

// Cria uma instância base do axios
const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
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

export function createPurchase(data: any) {
  return api.post('/purchase', data);
}


export function getPurchases() {
  return api.get('/purchase')
}


export default api;