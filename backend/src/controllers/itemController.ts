// src/controllers/item.controller.ts
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import Item from "../models/itemModel";

interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

export const createItem = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, description, price, quantity, imageUrl } = req.body;

    const decoded = typeof req.user === "string" ? null : req.user;
    if (!decoded || !("id" in decoded)) {
      res.status(401).send("Invalid token payload");
      return;
    }

    const sellerId = decoded.id as number;

    const item = await Item.create({
      title,
      description,
      price,
      quantity,
      imageUrl,
      sellerId,
    });

    res.status(201).json(item);
  } catch (err) {
    console.error("[createItem] Error:", err);
    res.status(500).send("Server error");
  }
};

export const getItems = async (_req: Request, res: Response) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (err) {
    console.error("[getItems] Error:", err);
    res.status(500).send("Server error");
  }
};

export const getItem = async (req: Request, res: Response) => {
  try {
    const item = await Item.findByPk(req.params.id);
    item ? res.json(item) : res.status(404).send("Item not found");
  } catch (err) {
    console.error("[getItem] Error:", err);
    res.status(500).send("Server error");
  }
};

export const updateItem = async (req: Request, res: Response) => {
  try {
    const [count, [updated]] = await Item.update(req.body, {
      where: { id: req.params.id },
      returning: true,
    });
    updated ? res.json(updated) : res.status(404).send("Item not found");
  } catch (err) {
    console.error("[updateItem] Error:", err);
    res.status(500).send("Server error");
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  try {
    const count = await Item.destroy({ where: { id: req.params.id } });
    count ? res.status(204).end() : res.status(404).send("Item not found");
  } catch (err) {
    console.error("[deleteItem] Error:", err);
    res.status(500).send("Server error");
  }
};
