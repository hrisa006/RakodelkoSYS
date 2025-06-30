import api from "./axios";
import type { Order } from "../types/types";

export const checkout = () =>
  api.post("/orders/checkout").then((r) => r.data as Order);

export const fetchOrders = () =>
  api.get("/orders").then((r) => r.data as Order[]);

export const fetchOrder = (id: number) =>
  api.get(`/orders/${id}`).then((r) => r.data as Order);

export const downloadInvoice = async (orderId: number) => {
  const blob = (
    await api.get(`/orders/${orderId}/invoice`, { responseType: "blob" })
  ).data as Blob;

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `invoice-${orderId}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
};
