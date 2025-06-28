import { Router } from "express";
import {
  createItem,
  getItems,
  getItem,
  updateItem,
  deleteItem,
} from "../controllers/itemController";
import authenticateToken from "../middlewares/authToken";

const router = Router();

router.get("/", getItems);
router.post("/", authenticateToken, createItem);
router.get("/:id", getItem);
router.put("/:id", authenticateToken, updateItem);
router.delete("/:id", authenticateToken, deleteItem);

export default router;
