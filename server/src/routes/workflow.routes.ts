import { Router } from "express";
import { sendReminders } from "../controllers/workflow.controller";

const workflowRouter = Router();

workflowRouter.post("/subscription/reminder", sendReminders);

export default workflowRouter;
