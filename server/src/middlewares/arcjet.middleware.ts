import { NextFunction, Request, Response } from "express";
import aj from "../config/arcjet.js";
import { describe } from "node:test";

const arcjetMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const decision = await aj.protect(req, { requested: 1 });
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({ message: "Rate limit exceeded" });
      }
      if (decision.reason.isBot()) {
        return res.status(403).json({ message: "Access denied" });
      }
    }
    next();
  } catch (error) {
    console.log(`Arcjet middleware error ${error}`);
  }
};
export default arcjetMiddleware;
