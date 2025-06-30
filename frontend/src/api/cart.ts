import api from './axios';
import type { CartItem } from '../types/types';

export const fetchCart = () =>
  api.get('/cart').then((r) => r.data as CartItem[]);

export const addToCart = (itemId: number, quantity = 1) =>
  api.post('/cart', { itemId, quantity });

export const updateQty = (itemId: number, quantity: number) =>
  api.put(`/cart/${itemId}`, { quantity });

export const removeFromCart = (itemId: number) =>
  api.delete(`/cart/${itemId}`);

export const clearCart = () => api.delete('/cart');
