import api from './axios';
import type { Order } from '../types/types';

export const checkout = () =>
  api.post('/orders/checkout').then((r) => r.data as Order);

export const fetchOrders = () =>
  api.get('/orders').then((r) => r.data as Order[]);

export const fetchOrder = (id: number) =>
  api.get(`/orders/${id}`).then((r) => r.data as Order);
