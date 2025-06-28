import { Router } from "express";
import authenticateToken from "../middlewares/authToken";
import {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
} from "../controllers/reviewController";

const router = Router({ mergeParams: true });

router.get("/", getReviews);
router.post("/", authenticateToken, createReview);
router.put("/:id", authenticateToken, updateReview);
router.delete("/:id", authenticateToken, deleteReview);

export default router;
