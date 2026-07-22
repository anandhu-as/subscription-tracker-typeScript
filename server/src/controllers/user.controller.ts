import User from "../dbmodels/user.model";
import { Request, Response, NextFunction } from "express";

export const getUsers = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find();
    if (users.length < 1) {
      response
        .status(404)
        .json({ message: "User not found create user first!" });
    } else {
      response.status(200).json({ success: true, data: users });
    }
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(request.params.id).select("-password");
    if (!user) {
      const error: any = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    response.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
