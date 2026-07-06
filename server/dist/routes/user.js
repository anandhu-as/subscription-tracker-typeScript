import { Router } from "express";
import { getUserById, getUsers } from "../controllers/user.controller";
import { authorize } from "../middlewares/auth.middleware";
export const userRouter = Router();
userRouter.get("/", getUsers);
userRouter.get("/:id", authorize, getUserById);
