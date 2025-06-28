import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import Shipping from "../models/shippingModel";

interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

export const getShipping = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const orderId = Number(req.params.orderId);
    const shipping = await Shipping.findOne({ where: { orderId } });
    shipping
      ? res.json(shipping)
      : res.status(404).send("No shipping address found");
  } catch (err) {
    console.error("[getShipping] Error:", err);
    res.status(500).send("Server error");
  }
};

export const createOrUpdateShipping = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const orderId = Number(req.params.orderId);
  const {
    recipientName,
    addressLine1,
    addressLine2,
    city,
    postalCode,
    country,
  } = req.body;

  const [shipping, created] = await Shipping.upsert(
    {
      orderId,
      recipientName,
      addressLine1,
      addressLine2,
      city,
      postalCode,
      country,
    },
    { returning: true }
  );

  res.status(created ? 201 : 200).json(shipping);
};

export const deleteShipping = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const orderId = Number(req.params.orderId);
    const count = await Shipping.destroy({ where: { orderId } });
    count
      ? res.status(204).end()
      : res.status(404).send("No shipping address to delete");
  } catch (err) {
    console.error("[deleteShipping] Error:", err);
    res.status(500).send("Server error");
  }
};
