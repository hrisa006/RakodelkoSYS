import { Router, Request, Response } from "express";
import { register, login, logout } from "../controllers/authController";

const router = Router();

router.get("/login", (_req: Request, res: Response): void => {
  res.render("layout", {
    title: "Login",
    user: null,
    page: "login",
    error: null,
  });
});

router.get("/register", (_req: Request, res: Response): void => {
  res.render("layout", {
    title: "Register",
    user: null,
    page: "registration",
    error: null,
  });
});

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

export default router;
