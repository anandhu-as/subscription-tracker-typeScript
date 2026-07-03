import express, { Request, Response, NextFunction } from "express";
import { PORT } from "./config/env";
import { authRouter } from "./routes/auth";
import { userRouter } from "./routes/user";
import { subscriptionRouter } from "./routes/subscription";
import connectToDatabase from "./db/mongodb";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();
app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscription", subscriptionRouter);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`SubAPI is running on port ${PORT}`);
  connectToDatabase();
});

app.get("/", (request: Request, response: Response) => {
  response.send("Hello fellasss welcome to SubAPI");
});

export { app };