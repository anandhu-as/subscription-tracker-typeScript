import { Router } from "express";
import { authorize } from "../middlewares/auth.middleware";
import { createSubscription, getSubscriptions, getUserSubscriptions, } from "../controllers/subscription.controller";
export const subscriptionRouter = Router();
subscriptionRouter.post("/", authorize, createSubscription);
subscriptionRouter.get("/", authorize, getSubscriptions);
subscriptionRouter.get("/:id", authorize, getUserSubscriptions);
