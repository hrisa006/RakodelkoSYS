import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import User from "../models/userModel";

export const authorizeRole = (required: "admin" | "user") => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userJwt = req.user as JwtPayload | undefined;
    if (!userJwt || !("id" in userJwt)) {
      return res.status(401).send("Unauthorized");
    }

    const user = await User.findByPk(userJwt.id);
    if (!user) {
      return res.status(401).send("Unauthorized");
    }

    if (user.role !== required) {
      return res.status(403).send("Forbidden");
    }

    next();
  };
};

export default authorizeRole;
