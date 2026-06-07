import express from "express";
import cookieParser from "cookie-parser";
import { PORT } from "./config/env.js";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import workflowRouter from "./routes/workflow.routes.js";
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
<<<<<<< HEAD
import arcjetMiddleware from "./middlewares/arcjet.middleware.js";
import workflowRouter from "./routes/workflow.routes.js";
=======

>>>>>>> 510cb295c37d4842b72cf359431b293c34b65e54
const app = express();
app.use(express.json());
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", arcjetMiddleware, userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/workflows", workflowRouter);
<<<<<<< HEAD

=======
>>>>>>> 510cb295c37d4842b72cf359431b293c34b65e54
app.use(errorMiddleware);
app.use(arcjetMiddleware);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Welcome to the subscription tracker api");
});
app.listen(PORT, async () => {
  console.log(`server running on port ${PORT}`);
  await connectToDatabase();
});
