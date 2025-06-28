import { Request, Response } from "express";
import Media from "../models/mediaModel";

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
