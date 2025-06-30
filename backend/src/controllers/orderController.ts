import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import Order from "../models/orderModel";
import OrderItem from "../models/orderItemModel";
import CartItem from "../models/cartItemModel";
import Item from "../models/itemModel";
import { sequelize } from "../config/database";

interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

export const checkout = async (req: AuthenticatedRequest, res: Response) => {
  const userId = (req.user as JwtPayload).id;

  const cartItems = await CartItem.findAll({
    where: { userId },
    include: [
      {
        model: Item,
        as: "item",
      },
    ],
  });

  if (cartItems.length === 0) {
    res.status(400).send("Cart is empty");
    return;
  }

  let total = 0;
  const orderItemsPayload = cartItems.map((ci) => {
    const price = ci.item.price;
    total += price * ci.quantity;
    return {
      itemId: ci.itemId,
      quantity: ci.quantity,
      price,
    };
  });

  try {
    const result = await sequelize.transaction(async (t) => {
      const order = await Order.create(
        { userId, totalPrice: total },
        { transaction: t }
      );

      await OrderItem.bulkCreate(
        orderItemsPayload.map((oi) => ({ ...oi, orderId: order.id })),
        { transaction: t }
      );

      await CartItem.destroy({ where: { userId }, transaction: t });

      const fullOrder = await Order.findByPk(order.id, {
        include: [OrderItem],
        transaction: t,
      });

      return fullOrder;
    });

    res.status(201).json(result);
    return;
  } catch (err) {
    console.error("[checkout] Error:", err);
    res.status(500).send("Failed to complete checkout.");
    return;
  }
};

export const getOrders = async (req: AuthenticatedRequest, res: Response) => {
  const userId = (req.user as JwtPayload)?.id;
  try {
    const orders = await Order.findAll({
      where: { userId },
      include: [OrderItem],
    });
    res.json(orders);
  } catch (err) {
    console.error("[getOrders] Error:", err);
    res.status(500).send("Server error");
  }
};

export const getOrder = async (req: AuthenticatedRequest, res: Response) => {
  const userId = (req.user as JwtPayload)?.id;
  const orderId = parseInt(req.params.id);

  if (isNaN(orderId)) {
    res.status(400).send("Invalid order ID");
    return;
  }

  try {
    const order = await Order.findOne({
      where: { id: orderId, userId },
      include: [OrderItem],
    });

    order ? res.json(order) : res.status(404).send("Order not found");
  } catch (err) {
    console.error("[getOrder] Error:", err);
    res.status(500).send("Server error");
  }
};
