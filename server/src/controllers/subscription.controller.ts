import { Request, Response, NextFunction } from "express";
import Subscription from "../models/subscription.model.js";
import { CustomError } from "../types/types.js";
import { workflowClient } from "../config/upstash.js";
import { SERVER_URL } from "../config/env.js";

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

    await workflowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
      body: {
        subscriptionId: subscription._id,
      },
    });

    res.status(201).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

export const getUserSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.user.id !== req.params.id) {
      const error: CustomError = new Error(
        "You are not the owner of this account",
      );
      error.statusCode = 401;
      throw error;
    }
    const subscriptions = await Subscription.find({ user: req.params.id });
    res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
};
export const getSubscriptionDetails = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      const error: CustomError = new Error("Subscription not found");
      error.statusCode = 404;
      throw error;
    }

    if (subscription.user.toString() !== req.user.id) {
      const error: CustomError = new Error(
        "You are not the owner of this subscription",
      );
      error.statusCode = 401;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};
