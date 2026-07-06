import { NextFunction, Request, Response } from "express";
import { aj } from "../config/arcjet";

 const arcjetMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const decision = await aj.protect(request, {
      requested: 1,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return response.status(429).json({
          message: "Rate limit exceeded",
        });
      }

      if (decision.reason.isBot()) {
        return response.status(403).json({
          message: "Bot detected",
        });
      }

      return response.status(403).json({
        message: "Access denied",
      });
    }

    next();
  } catch (error) {
    console.error("Arcjet middleware error:", error);
    next(error);
  }
};
export default arcjetMiddleware