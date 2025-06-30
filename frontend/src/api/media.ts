import type { Media } from '../types/types';
import api from './axios';

export const fetchMedia = (itemId: number) =>
  api.get(`/media/${itemId}`).then((r) => r.data as Media[]);

export const uploadImage = (itemId: number, file: File) => {
  const fd = new FormData();
  fd.append('image', file);
  fd.append('itemId', String(itemId));
  return api.post('/media', fd).then((r) => r.data);
};
