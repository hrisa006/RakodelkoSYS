import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import Review from "../models/reviewModel";
import Item from "../models/itemModel";
import { RatingValue } from "../models/reviewModel";

interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

export const createReview = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { itemId } = req.params;
    const { rating, comment } = req.body as {
      rating: RatingValue;
      comment: string;
    };

    if (!rating || rating < 1 || rating > 5) {
      res.status(400).send("Rating must be between 1 and 5");
      return;
    }

    const userId = (req.user as JwtPayload).id;

    const item = await Item.findByPk(itemId);
    if (!item) {
      res.status(404).send("Item not found");
      return;
    }

    const review = await Review.create({
      userId,
      itemId: Number(itemId),
      rating,
      comment,
    });
    res.status(201).json(review);
  } catch (error) {
    console.error("[createReview] Error:", error);
    res.status(500).send("Server error");
  }
};

export const getReviews = async (req: Request, res: Response) => {
  const { itemId } = req.params;
  try {
    const reviews = await Review.findAll({ where: { itemId } });
    res.json(reviews);
  } catch (error) {
    console.error("[getReviews] Error:", error);
    res.status(500).send("Server error");
  }
};

export const updateReview = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { id } = req.params;
  const { rating, comment } = req.body as {
    rating?: RatingValue;
    comment?: string;
  };
  const userId = (req.user as JwtPayload).id;

  try {
    const review = await Review.findByPk(id);
    if (!review) {
      res.status(404).send("Review not found");
      return;
    }
    if (review.userId !== userId) {
      res.status(403).send("Forbidden");
      return;
    }

    await review.update({
      rating: rating ?? review.rating,
      comment: comment ?? review.comment,
    });
    res.json(review);
  } catch (error) {
    console.error("[updateReview] Error:", error);
    res.status(500).send("Server error");
  }
};

export const deleteReview = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { id } = req.params;
  const userId = (req.user as JwtPayload).id;

  try {
    const deleted = await Review.destroy({ where: { id, userId } });
    deleted ? res.status(204).end() : res.status(404).send("Review not found");
  } catch (error) {
    console.error("[deleteReview] Error:", error);
    res.status(500).send("Server error");
  }
};
