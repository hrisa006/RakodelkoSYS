import { Router } from "express";
import authenticateToken from "../middlewares/authToken";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartController";

const router = Router();
router.use(authenticateToken);

router.get("/", getCart);
router.post("/", addToCart);
router.put("/:id", updateCartItem);
router.delete("/", clearCart);
router.delete("/:id", removeCartItem);

export default router;
