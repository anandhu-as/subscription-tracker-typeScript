import { JWT_SECRET } from "../config/env";
import jwt from "jsonwebtoken";
import User, { IUser } from "../dbmodels/user.model";
import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  user?: IUser;
}

export const authorize = async (request: AuthRequest, response: Response, next: NextFunction) => {
  try {
    let token;

    if (
      request.headers.authorization &&
      request.headers.authorization.startsWith("Bearer")
    ) {
      token = request.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return response.status(401).json({
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET!) as { userId: string };

    const user = await User.findById(decoded.userId);

    if (!user) {
      return response.status(401).json({
        message: "Unauthorized: User not found",
      });
    }

    request.user = user;

    next();
  } catch (error: any) {
    return response.status(401).json({
      message: "Unauthorized",
      error: error.message,
    });
  }
};
