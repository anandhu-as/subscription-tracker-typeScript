import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env";

if (!DB_URI) {
  throw new Error("define the MONGODB_URI in .env");
}

const connectToDatabase = async () => {
  try {
    await mongoose.connect(DB_URI!);
    console.log(`connected to db in ${NODE_ENV} mode`);
  } catch (error) {
    console.log("error connecting to database", error);
  }
};

export default connectToDatabase;
