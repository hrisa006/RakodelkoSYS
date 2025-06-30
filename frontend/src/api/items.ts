import api from "./axios";
import type { Item } from "../types/types";

export const fetchItems = async (): Promise<Item[]> =>
  (await api.get("/items")).data;

export const fetchItem = (id: number) =>
  api.get(`/items/${id}`).then((r) => r.data as Item);

export const createItem = (payload: Partial<Item>) =>
  api.post("/items", payload).then((r) => r.data as Item);

export const updateItem = (id: number, payload: Partial<Item>) =>
  api.put(`/items/${id}`, payload).then((r) => r.data);

export const deleteItem = (id: number) => api.delete(`/items/${id}`);

export const getItemById = async (id: number): Promise<Item> => {
  const res = await api.get(`/items/${id}`);
  return res.data;
};

export const fetchNewItems = async (): Promise<Item[]> =>
  (await api.get("/items?sort=new")).data;


export const fetchMyItems = async (): Promise<Item[]> =>
  (await api.get("/items/me")).data;

export const removeItem = (id: number) =>
  api.delete(`/items/${id}`); 