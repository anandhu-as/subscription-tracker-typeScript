import { Request, Response, NextFunction } from "express";
import Subscription from "../dbmodels/subscription.model";
import { AuthRequest } from "../middlewares/auth.middleware";
export const createSubscription = async(
  request: AuthRequest,
  response: Response,
  next: NextFunction,
) => {
    try {
        const subscription=await Subscription.create({...request.body,user:request.user!._id})
        response.status(201).json({message:"success",data:subscription})
    } catch (error) {
        console.log("Error creating subscription:", error);
        next(error);
    }
};
