import { Request, Response, NextFunction } from "express";
import Subscription from "../dbmodels/subscription.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import { workFlowClient } from "../config/upstash";
import { SERVER_URL } from "../config/env";
export const createSubscription = async (
  request: AuthRequest,
  response: Response,
  next: NextFunction,
) => {
  try {
    const subscription = await Subscription.create({
      ...request.body,
      user: request.user!._id,
    });

    const { workflowRunId } = await workFlowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
      body: {
        subscriptionId: subscription.id,
      },
      headers: {
        "content-type": "application/json",
      },
      retries: 0,
    });

    return response.status(201).json({
      message: "success",
      data: subscription,
      workflowRunId,
    });
  } catch (error) {
    console.log("Error while creating subscription:", error);
    next(error);
  }
};
export const getSubscriptions = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const subscriptions = await Subscription.find();
    response.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
};
export const getUserSubscriptions = async (
  request: AuthRequest,
  response: Response,
  next: NextFunction,
) => {
  try {
    const subscriptions = await Subscription.find({
      user: request.user!._id,
    });
    subscriptions.length === 0 &&
      response.status(200).json({
        success: "true",
        message: "No subscriptions left ,add subscriptions... ",
      });

    response.status(200).json({
      success: true,
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
};
