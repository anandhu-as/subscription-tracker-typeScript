import { Request, Response, NextFunction } from "express";
import subscription from "../models/subscription.model.js";
import Subscription from "../models/subscription.model.js";
export const createSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });
    res.status(201).json({success:true,data:subscription})
  } catch (error) {
    next(error);
  }
};

