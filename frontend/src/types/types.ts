export interface User {
  id: number;
  username: string;
}

export interface Item {
  id: number;
  title: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  seller: User;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: number;
  itemId: number;
  quantity: number;
  item: Item;
}

export interface OrderItem {
  id: number;
  orderId: number;
  itemId: number;
  quantity: number;
  price: number;
  item: Item;
}

export type OrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  id: number;
  userId: number;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  OrderItems: OrderItem[];
}

export interface Review {
  id: number;
  itemId: number;
  userId: number;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: User;
}

export interface Media {
  id: number;
  itemId: number;
  url: string;
  altText?: string;
}

export interface Shipping {
  id: number;
  orderId: number;
  recipientName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  country: string;
}
