import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { createSubscription, getUserSubscription, getSubscriptionDetails, } from "../controllers/subscription.controller.js";
const subscriptionRouter = Router();
subscriptionRouter.get("/", (req, res) => {
    title: "GET all subscriptions";
});
subscriptionRouter.get("/:id", authorize, getSubscriptionDetails);
subscriptionRouter.post("/", authorize, createSubscription);
subscriptionRouter.put("/", (req, res) => {
    title: "UPDATE subscriptions";
});
subscriptionRouter.delete("/", (req, res) => {
    title: "delete  subscription";
});
subscriptionRouter.get("/users/:id", authorize, getUserSubscription);
subscriptionRouter.get("/upcoming-renewals", (req, res) => {
    title: "GET upcoming renewals";
});
export default subscriptionRouter;
