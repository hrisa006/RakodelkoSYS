import { Request, Response } from "express";
import CartItem from "../models/cartItemModel";
import Item from "../models/itemModel";
import { JwtPayload } from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

export const getCart = async (req: AuthenticatedRequest, res: Response) => {
  const userId = (req.user as JwtPayload)?.id;

  try {
    const items = await CartItem.findAll({
      where: { userId },
      include: [{ model: Item, as: "item" }],
    });
    res.json(items);
  } catch (err) {
    console.error("[getCart] Error:", err);
    res.status(500).send("Server error");
  }
};

export const addToCart = async (req: AuthenticatedRequest, res: Response) => {
  const userId = (req.user as JwtPayload)?.id;
  const { itemId, quantity } = req.body;
  try {
    const existing = await CartItem.findOne({ where: { userId, itemId } });
    if (existing) {
      existing.quantity += quantity;
      await existing.save();
      res.json(existing);
      return;
    }
    const cartItem = await CartItem.create({ userId, itemId, quantity });
    res.status(201).json(cartItem);
  } catch (err) {
    console.error("[addToCart] Error:", err);
    res.status(500).send("Server error");
  }
};

export const updateCartItem = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = (req.user as JwtPayload)?.id;
  const { quantity } = req.body;
  const { id } = req.params;

  try {
    const cartItem = await CartItem.findOne({ where: { id, userId } });
    if (!cartItem) {
      res.status(404).send("Item not found");
      return;
    }

    cartItem.quantity = quantity;
    await cartItem.save();
    res.json(cartItem);
  } catch (err) {
    console.error("[updateCartItem] Error:", err);
    res.status(500).send("Server error");
  }
};

export const removeCartItem = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = (req.user as JwtPayload)?.id;
  const { id } = req.params;

  try {
    const deleted = await CartItem.destroy({ where: { id, userId } });
    deleted ? res.status(204).end() : res.status(404).send("Item not found");
  } catch (err) {
    console.error("[removeCartItem] Error:", err);
    res.status(500).send("Server error");
  }
};
