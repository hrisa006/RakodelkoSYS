/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import * as itemsApi from "../api/items";
import * as cartApi from "../api/cart";
import * as ordersApi from "../api/orders";
import type { Item, CartItem, Order } from "../types/types";
import { useAuth } from "./AuthContext";

interface ShopContextType {
  items: Item[];
  cart: CartItem[];
  orders: Order[];
  isLoadingItems: boolean;
  isLoadingCart: boolean;
  isLoadingOrders: boolean;

  fetchItems: () => Promise<void>;
  addToCart: (item: Item, qty?: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  updateCartQty: (itemId: number, qty: number) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: () => Promise<{ url: string; orderId: number }>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);
export const useShop = () => {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
};

const GUEST_CART_KEY = "guest_cart";

const readGuestCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(GUEST_CART_KEY);
  if (!raw) return [];
  try {
    const stored = JSON.parse(raw) as Array<{
      itemId: number;
      quantity: number;
      item: Item;
    }>;
    return stored.map((entry) => ({
      id: entry.itemId,
      userId: 0,
      itemId: entry.itemId,
      quantity: entry.quantity,
      item: entry.item,
    }));
  } catch {
    return [];
  }
};

const writeGuestCart = (cartItems: CartItem[]) => {
  if (typeof window === "undefined") return;
  const payload = cartItems.map((ci) => ({
    itemId: ci.itemId,
    quantity: ci.quantity,
    item: ci.item,
  }));
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(payload));
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
  const { user } = useAuth();

  const fetchItems = useCallback(async () => {
    setLI(true);
    try {
      const data = await itemsApi.fetchItems();
      setItems(data);
    } finally {
      setLI(false);
    }
  }, []);

  const loadCart = async () => {
    setLC(true);
    try {
      if (user) {
        const data = await cartApi.fetchCart();
        setCart(data);
      } else {
        setCart(readGuestCart());
      }
    } finally {
      setLC(false);
    }
  };

  const addToCart = async (item: Item, qty = 1) => {
    if (user) {
      await cartApi.addToCart(item.id, qty);
      await loadCart();
      return;
    }

    const current = readGuestCart();
    const existing = current.find((ci) => ci.itemId === item.id);
    if (existing) {
      existing.quantity += qty;
    } else {
      current.push({
        id: item.id,
        userId: 0,
        itemId: item.id,
        quantity: qty,
        item,
      });
    }
    writeGuestCart(current);
    setCart(current);
  };

  const removeFromCart = async (itemId: number) => {
    if (user) {
      await cartApi.removeFromCart(itemId);
      await loadCart();
      return;
    }
    const next = readGuestCart().filter((ci) => ci.itemId !== itemId);
    writeGuestCart(next);
    setCart(next);
  };

  const updateCartQty = async (itemId: number, qty: number) => {
    if (user) {
      await cartApi.updateQty(itemId, qty);
      await loadCart();
      return;
    }
    const next = readGuestCart().map((ci) =>
      ci.itemId === itemId ? { ...ci, quantity: qty } : ci
    );
    writeGuestCart(next);
    setCart(next);
  };

  const clearCart = async () => {
    if (user) {
      await cartApi.clearCart();
      await loadCart();
      return;
    }
    writeGuestCart([]);
    setCart([]);
  };

  const loadOrders = async () => {
    setLO(true);
    try {
      if (user) {
        const data = await ordersApi.fetchOrders();
        setOrders(data);
      } else {
        setOrders([]);
      }
    } finally {
      setLO(false);
    }
  };

  const checkout = async () => {
    if (!user) {
      throw new Error("auth_required");
    }
    const session = await ordersApi.checkout();
    return session;
  };

  const syncGuestCartToServer = async () => {
    const guestItems = readGuestCart();
    if (guestItems.length === 0) return;
    for (const ci of guestItems) {
      await cartApi.addToCart(ci.itemId, ci.quantity);
    }
    writeGuestCart([]);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    const init = async () => {
      if (user) {
        try {
          await syncGuestCartToServer();
        } catch (err) {
          console.error("[syncGuestCart] error", err);
        }
        await loadCart();
        await loadOrders();
      } else {
        await loadCart();
        setOrders([]);
      }
    };
    init();
  }, [user]);

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
