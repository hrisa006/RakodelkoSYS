import { Router } from "express";
import {
  createItem,
  getItems,
  getItem,
  updateItem,
  deleteItem,
  getMyItems,
  deleteOwnItem,
} from "../controllers/itemController";
import authenticateToken from "../middlewares/authToken";

const router = Router();

router.get("/me", authenticateToken, getMyItems);
router.delete("/:id", authenticateToken, deleteOwnItem);
router.get("/", getItems);
router.post("/", authenticateToken, createItem);
router.get("/:id", getItem);
router.put("/:id", authenticateToken, updateItem);
router.delete("/:id", authenticateToken, deleteItem);

export default router;
