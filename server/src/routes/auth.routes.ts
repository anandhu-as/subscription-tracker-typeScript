import { Router } from "express";
import { signIn, signOut, signUp } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/sign-up", (req, res) => signUp);

authRouter.post("/sign-in", (req, res) => signIn);

authRouter.post("/sign-out", (req, res) => signOut);

export default authRouter;
