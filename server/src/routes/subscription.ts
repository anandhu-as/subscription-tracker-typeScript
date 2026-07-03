import { Router, Request, Response } from "express";

export const subscriptionRouter = Router();

subscriptionRouter.get("/", (request: Request, response: Response) => {
  response.json({ message: "hello there SUBSCRIPTION GET " });
});
