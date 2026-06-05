import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import { CustomError } from "../types/types.js";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";
export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    //create a new user
    const { name, email, password } = req.body;
    console.log(req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error: CustomError = new Error("user already exists");
      error.statusCode = 409;
      throw error;
    }
    //hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUsers = await User.create(
      [{ name, email, password: hashedPassword }],
      { session },
    );
    const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN as SignOptions["expiresIn"],
    });
    //saving the changes
    await session.commitTransaction();
    session.endSession();
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        token,
        user: newUsers[0],
      },
    });
  } catch (error) {
    //if anything goes wrong we can rollback all the changes
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
