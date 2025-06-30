import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import Item from "../models/itemModel";
import User from "../models/userModel";

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
    const sort = _req.query.sort as string;

    const items = await Item.findAll({
      include: {
        model: User,
        as: "seller",
        attributes: ["username"],
      },
      order: sort === "new" ? [["updatedAt", "DESC"]] : undefined,
    });

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

export const getMyItems = async (req: AuthenticatedRequest, res: Response) => {
  const userId = (req.user as JwtPayload).id;
  const items = await Item.findAll({ where: { sellerId: userId } });
  res.json(items);
};

export const deleteOwnItem = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = (req.user as JwtPayload).id;
    const { id } = req.params;
    const item = await Item.findByPk(id);

    if (!item) {
      res.status(404).send("Item not found");
      return;
    }
    if (item.sellerId !== userId) {
      res.status(403).send("Not your item");
      return;
    }

    await item.destroy();
    res.status(204).end();
  } catch (err) {
    console.error("[deleteOwnItem] Error:", err);
    res.status(500).send("Server error");
  }
};
