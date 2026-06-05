import { Router } from "express";
const subscriptionRouter = Router();
subscriptionRouter.get("/", (req, res) => {
    title: "GET all subscriptions";
});
subscriptionRouter.get("/:id", (req, res) => {
    title: "GET  subscription details";
});
subscriptionRouter.post("/", (req, res) => {
    title: "CREATE subscriptions";
});
subscriptionRouter.put("/", (req, res) => {
    title: "UPDATE subscriptions";
});
subscriptionRouter.delete("/", (req, res) => {
    title: "delete  subscription";
});
subscriptionRouter.get("/users/:id", (req, res) => {
    title: "GET all user subscriptions";
});
subscriptionRouter.get("/upcoming-renewals", (req, res) => {
    title: "GET upcoming renewals";
});
export default subscriptionRouter;
