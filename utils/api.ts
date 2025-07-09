import axios from 'axios';
import { parseCookies } from 'nookies';
export type ApiCard = {
  id: number;
  name: string;
  card_sets: string[];
};

export type ApiPurchase = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  updatedAt: string;
};

export type Pagination<T> = {
  page: number;
  total: number;
  data: T[];
};

export type ApiRarity = {
  id: string;
  name: string;
};

export type ApiUser = {
  id: string;
  name: string;
  image: string;
};

export type ApiPurchaseDetails = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
};

export type ApiShoppingList = {
  id: string;
  userId: string;
  purchaseId: string;
  user: ApiUser;
  purchase: ApiPurchaseDetails;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const cookies = parseCookies();
    const isProd = process.env.NODE_ENV === 'production';
    const cookieName = isProd ? '__Secure-next-auth.session-token' : 'next-auth.session-token';
    const token = cookies[cookieName];

    if (token && config.headers) {
      config.headers.set('Cookie', `${cookieName}=${token}`);
    }
  }

  return config;
});

export async function createPurchase(data: any) {
  return api.post('/purchase', data);
}

export async function createShoppingList(data: any) {
  return api.post('/shopping-list', data);
}

export async function getRatities() {
  const result = await api.get<ApiPurchase[]>('/rarities');
  return result;
}

export async function getPurchases({ page = 1, limit = 10 }: { page?: number; limit?: number }) {
  const result = await api.get<Pagination<ApiPurchase>>('/purchase', {
    params: { page, limit },
  });

  return result;
}

export async function getXlsx(purchaseId: string) {
  const result = await api.get(`/shopping-list/purchase/${purchaseId}/export-excel`, {
    responseType: 'blob',
  });

  return result;
}

export async function getCards(query: string) {
  return api.get<ApiCard[]>(`/cards?name=${query}`);
}

export default api;
