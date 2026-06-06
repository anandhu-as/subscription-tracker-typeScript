import { NextFunction, Request, Response } from "express";
import User from "../models/user.model.js";
import { CustomError } from "../types/types.js";
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};
export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      const error: CustomError = new Error("user not found");
      error.statusCode = 404;
      throw error;
    }
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      const error: CustomError = new Error("user not found");
      error.statusCode = 404;
      throw error;
    }
    return res.status(200).json({
      success: true,
      message: "user deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
