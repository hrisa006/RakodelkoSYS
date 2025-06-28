import { Router, Request, Response, NextFunction } from "express";
import authenticateToken from "../middlewares/authToken";
import { authorizeRole } from "../middlewares/authorizeRole";
import User, { UserRole } from "../models/userModel";
import Item from "../models/itemModel";
import Order from "../models/orderModel";

const router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
  authenticateToken(req, res, () => authorizeRole("admin")(req, res, next));
});

router.get("/users", async (_req, res) => {
  const users = await User.findAll({ attributes: ["id", "username", "role"] });
  res.json(users);
});

router.put("/users/:id/role", async (req: Request, res: Response) => {
  try {
    const { role } = req.body as { role: UserRole };
    if (!["user", "admin"].includes(role)) {
      res.status(400).send("Invalid role");
      return;
    }
    const user = await User.findByPk(req.params.id);
    if (!user) {
      res.status(404).send("User not found");
      return;
    }

    await user.update({ role });
    res.json({ id: user.id, username: user.username, role: user.role });
  } catch (error) {
    console.error("[admin] PUT /users/:id/role →", error);
    res.status(500).send("Server error");
  }
});

router.get("/items", async (_req, res) => {
  const items = await Item.findAll();
  res.json(items);
});

router.delete("/items/:id", async (req, res) => {
  const deleted = await Item.destroy({ where: { id: req.params.id } });
  deleted ? res.status(204).end() : res.status(404).send("Item not found");
});

router.get("/orders", async (_req, res) => {
  const orders = await Order.findAll();
  res.json(orders);
});

router.put("/orders/:id/status", async (req, res) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) {
    res.status(404).send("Order not found");
    return;
  }
  const { status } = req.body;
  await order.update({ status });
  res.json(order);
});

export default router;
