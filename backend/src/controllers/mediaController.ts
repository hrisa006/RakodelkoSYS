import { Request, Response } from "express";
import Media from "../models/mediaModel";
import Item from "../models/itemModel";

export const uploadMedia = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.body;
    const file = req.file;

    if (!file) {
      res.status(400).send("No file uploaded");
      return;
    }

    const media = await Media.create({
      itemId,
      url: `/uploads/${file.filename}`,
      altText: file.originalname,
    });

    const item = await Item.findByPk(itemId);
    if (item && !item.imageUrl) {
      await item.update({ imageUrl: `/uploads/${file.filename}` });
    }

    res.status(201).json(media);
  } catch (err) {
    console.error("[uploadMedia] Error:", err);
    res.status(500).send("Server error");
  }
};

export const getItemMedia = async (req: Request, res: Response) => {
  try {
    const itemId = Number(req.params.itemId);
    const media = await Media.findAll({ where: { itemId } });
    res.json(media);
  } catch (err) {
    console.error("[getItemMedia] Error:", err);
    res.status(500).send("Server error");
  }
};
