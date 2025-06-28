import { Router } from "express";
import authenticateToken from "../middlewares/authToken";
import { checkout, getOrders, getOrder } from "../controllers/orderController";

const router = Router();

router.post("/checkout", authenticateToken, checkout);
router.get("/", authenticateToken, getOrders);
router.get("/:id", authenticateToken, getOrder);

export default router;
