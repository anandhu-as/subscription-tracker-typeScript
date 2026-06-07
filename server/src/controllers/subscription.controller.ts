import { Request, Response, NextFunction } from "express";
import subscription from "../models/subscription.model.js";
import Subscription from "../models/subscription.model.js";
import { WorkflowClient } from "../config/upstash.js";
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
    await WorkflowClient.trigger({
      url: `${SERVER_URL}api/v1/workflows/subscription/reminder`,
      body: {
        subscriptionId: subscription.id,
        Headers: {
          "content-type": "application/json",
        },
        retries:0
      },
    });
    res.status(201).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};
