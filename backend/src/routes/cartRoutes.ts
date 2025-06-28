import { Router } from "express";
import authenticateToken from "../middlewares/authToken";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} from "../controllers/cartController";

const router = Router();

router.get("/", authenticateToken, getCart);
router.post("/", authenticateToken, addToCart);
router.put("/:id", authenticateToken, updateCartItem);
router.delete("/:id", authenticateToken, removeCartItem);

export default router;
