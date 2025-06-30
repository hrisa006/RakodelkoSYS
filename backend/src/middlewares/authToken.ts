import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload;
    }
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies?.auth_cookie as string | undefined;

  if (!token) {
    res.status(401).json({ message: "Unauthenticated" });
    return;
  }

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
    (err, decoded) => {
      if (err) {
        res.status(401).json({ message: "Unauthenticated" });
        return;
      }

      req.user = decoded;
      next();
    }
  );
};

export default authenticateToken;
