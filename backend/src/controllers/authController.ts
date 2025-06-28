import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

import User from "../models/userModel";

declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload;
    }
  }
}

const COOKIE_NAME = "auth_cookie";
const COOKIE_MAX_AGE_MS = 60 * 60 * 1000;

const { ACCESS_TOKEN_SECRET, NODE_ENV } = process.env;
if (!ACCESS_TOKEN_SECRET) {
  throw new Error("ACCESS_TOKEN_SECRET env var is missing");
}

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body as {
      username: string;
      password: string;
    };

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ username, password: hashedPassword });

    const payload = { id: user.id, username: user.username };
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET);

    res.cookie(COOKIE_NAME, accessToken, {
      maxAge: COOKIE_MAX_AGE_MS,
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(201).json({ message: "Registration successful", user: payload });
    // res.redirect("/map");
  } catch (error) {
    console.error("[register] →", error);
    res.status(500).send("Internal server error");
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body as {
      username: string;
      password: string;
    };

    const user = await User.findOne({ where: { username } });
    if (!user) {
      res.status(400).json({ error: "Cannot find user" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(403).json({ error: "Incorrect password" });
      return;
    }

    const payload = { id: user.id, username: user.username };
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET);

    res.cookie(COOKIE_NAME, accessToken, {
      maxAge: COOKIE_MAX_AGE_MS,
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "Login successful", user: payload });
    // res.redirect("/map");
  } catch (error) {
    console.error("[login] →", error);
    res.status(500).send("Internal server error");
  }
};

export const logout = (_req: Request, res: Response): void => {
  res.clearCookie(COOKIE_NAME);
  res.status(200).json({ message: "Logged out" });
  // res.redirect("/auth/login");
};

export default { register, login, logout };
