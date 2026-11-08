import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getUserByToken } from "../services/user";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  const user = await getUserByToken(token);

  if (!user) {
    return res.status(401).json({ message: "Invalid token" });
  }

  (req as any).user = user;
  next();
};
