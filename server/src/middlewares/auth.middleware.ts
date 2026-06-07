import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user.model.js";
import { NextFunction, Request, Response } from "express";
import { JWT_SECRET } from "../config/env.js";

interface DecodedToken extends JwtPayload {
  userId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authorize = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized: No token provided",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized: User not found",
      });
    }

    req.user = user;

    next();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return res.status(401).json({
      message: "Unauthorized",
      error: message,
    });
  }
};
export default authorize;
