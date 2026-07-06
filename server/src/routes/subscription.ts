import { Router, Request, Response } from "express";
import { authorize } from "../middlewares/auth.middleware";
import { createSubscription } from "../controllers/subscription.controller";

export const subscriptionRouter = Router();


subscriptionRouter.post("/", authorize,createSubscription);
