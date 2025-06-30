/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import * as itemsApi from "../api/items";
import * as cartApi from "../api/cart";
import * as ordersApi from "../api/orders";
import type { Item, CartItem, Order } from "../types/types";

interface ShopContextType {
  items: Item[];
  cart: CartItem[];
  orders: Order[];
  isLoadingItems: boolean;
  isLoadingCart: boolean;
  isLoadingOrders: boolean;

  fetchItems: () => Promise<void>;
  addToCart: (itemId: number, qty?: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  updateCartQty: (itemId: number, qty: number) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: () => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);
export const useShop = () => {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<Item[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingItems, setLI] = useState(false);
  const [isLoadingCart, setLC] = useState(false);
  const [isLoadingOrders, setLO] = useState(false);

  const fetchItems = async () => {
    setLI(true);
    try {
      const data = await itemsApi.fetchItems();
      setItems(data);
    } finally {
      setLI(false);
    }
  };

  const loadCart = async () => {
    setLC(true);
    try {
      const data = await cartApi.fetchCart();
      setCart(data);
    } finally {
      setLC(false);
    }
  };

  const addToCart = async (itemId: number, qty = 1) => {
    await cartApi.addToCart(itemId, qty);
    await loadCart();
  };

  const removeFromCart = async (itemId: number) => {
    await cartApi.removeFromCart(itemId);
    await loadCart();
  };

  const updateCartQty = async (itemId: number, qty: number) => {
    await cartApi.updateQty(itemId, qty);
    await loadCart();
  };

  const clearCart = async () => {
    await cartApi.clearCart();
    await loadCart();
  };

  const loadOrders = async () => {
    setLO(true);
    try {
      const data = await ordersApi.fetchOrders();
      setOrders(data);
    } finally {
      setLO(false);
    }
  };

  const checkout = async () => {
    await ordersApi.checkout();
    await loadOrders();
    await loadCart();
  };

  useEffect(() => {
    fetchItems();
    loadCart();
    loadOrders();
  }, []);

  const value: ShopContextType = {
    items,
    cart,
    orders,
    isLoadingItems: isLoadingItems,
    isLoadingCart: isLoadingCart,
    isLoadingOrders: isLoadingOrders,
    fetchItems,
    addToCart,
    removeFromCart,
    updateCartQty,
    clearCart,
    checkout,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};
