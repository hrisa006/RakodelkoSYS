import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import Order from "../models/orderModel";
import OrderItem from "../models/orderItemModel";
import CartItem from "../models/cartItemModel";
import Item from "../models/itemModel";
import { sequelize } from "../config/database";
import Stripe from "stripe";

interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const BGN_TO_EUR_RATE = 1 / 1.95583;

const getStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("Stripe secret key is missing.");
  }
  return new Stripe(key);
};

export const checkout = async (req: AuthenticatedRequest, res: Response) => {
  const userId = (req.user as JwtPayload).id;
  let stripe: Stripe;
  try {
    stripe = getStripe();
  } catch (err) {
    console.error("[checkout] Stripe config error:", err);
    res.status(500).send("Stripe is not configured.");
    return;
  }

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

  const invalidItem = cartItems.find(
    (ci) =>
      !ci.item ||
      !Number.isFinite(Number(ci.item.price)) ||
      ci.quantity <= 0
  );
  if (invalidItem) {
    res.status(400).send("Cart contains invalid items.");
    return;
  }

  let total = 0;
  const orderItemsPayload = cartItems.map((ci) => {
    const price = Number(ci.item.price);
    total += price * ci.quantity;
    return {
      itemId: ci.itemId,
      quantity: ci.quantity,
      price,
    };
  });

  try {
    const order = await sequelize.transaction(async (t) => {
      const created = await Order.create(
        { userId, totalPrice: total },
        { transaction: t }
      );

      await OrderItem.bulkCreate(
        orderItemsPayload.map((oi) => ({ ...oi, orderId: created.id })),
        { transaction: t }
      );

      return created;
    });

    const lineItems = cartItems.map((ci) => {
      const unitAmount = Math.round(
        Number(ci.item.price) * BGN_TO_EUR_RATE * 100
      );
      if (!Number.isFinite(unitAmount) || unitAmount <= 0) {
        throw new Error("Invalid item price.");
      }
      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: ci.item.title,
          },
          unit_amount: unitAmount,
        },
        quantity: ci.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${FRONTEND_URL}/orders/${order.id}/confirm?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/cart?canceled=1`,
      metadata: {
        orderId: order.id.toString(),
        userId: userId.toString(),
        displayCurrency: "BGN",
        conversionRate: BGN_TO_EUR_RATE.toString(),
      },
    });

    if (!session.url) {
      res.status(500).send("Failed to create Stripe session.");
      return;
    }

    res.status(201).json({ url: session.url, orderId: order.id });
    return;
  } catch (err) {
    const details = err instanceof Error ? err.message : "Unknown error";
    console.error("[checkout] Error:", err);
    res
      .status(500)
      .json({ message: "Failed to start Stripe checkout.", details });
    return;
  }
};

export const confirmOrderPayment = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = (req.user as JwtPayload)?.id;
  const { orderId } = req.params;
  const { sessionId } = req.body as { sessionId?: string };

  if (!sessionId || !orderId) {
    res.status(400).send("Missing sessionId or orderId.");
    return;
  }

  let stripe: Stripe;
  try {
    stripe = getStripe();
  } catch (err) {
    console.error("[confirmOrderPayment] Stripe config error:", err);
    res.status(500).send("Stripe is not configured.");
    return;
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const metadata = session.metadata || {};

    if (
      metadata.orderId !== orderId ||
      metadata.userId !== userId?.toString()
    ) {
      res.status(403).send("Order does not match this session.");
      return;
    }

    if (session.payment_status !== "paid") {
      res.status(400).send("Payment not completed.");
      return;
    }

    const order = await Order.findOne({
      where: { id: Number(orderId), userId },
    });

    if (!order) {
      res.status(404).send("Order not found.");
      return;
    }

    if (order.status !== "paid") {
      order.status = "paid";
      await order.save();
      await CartItem.destroy({ where: { userId } });
    }

    res.json(order);
  } catch (err) {
    console.error("[confirmOrderPayment] Error:", err);
    res.status(500).send("Failed to confirm payment.");
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
