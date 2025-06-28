import { Router } from "express";
import authenticateToken from "../middlewares/authToken";
import { checkout, getOrders, getOrder } from "../controllers/orderController";
import { getInvoice } from "../controllers/invoiceController";
import {
  getShipping,
  createOrUpdateShipping,
  deleteShipping,
} from "../controllers/shippingController";

const router = Router();

router.use(authenticateToken);

router.post("/checkout", checkout);
router.get("/", getOrders);
router.get("/:id", getOrder);

router.get("/:orderId/invoice", getInvoice);

router.get("/:orderId/shipping", getShipping);
router.post("/:orderId/shipping", createOrUpdateShipping);
router.delete("/:orderId/shipping", deleteShipping);

export default router;
