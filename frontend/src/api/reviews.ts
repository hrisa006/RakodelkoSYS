import api from "./axios";
import type { Review } from "../types/types";

export const fetchReviews = (itemId: number) =>
  api.get(`/items/${itemId}/reviews`).then((r) => r.data as Review[]);

export const addReview = (itemId: number, payload: Partial<Review>) =>
  api.post(`/items/${itemId}/reviews`, payload).then((r) => r.data as Review);
