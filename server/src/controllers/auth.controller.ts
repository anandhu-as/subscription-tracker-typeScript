import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import { CustomError } from "../types/types.js";

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const error: CustomError = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};

export const signOut = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};
