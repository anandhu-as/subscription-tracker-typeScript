import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  statusCode?: number;
  code?: number;
  errors?: any;
}

const errorMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error: CustomError = { ...err };

  error.message = err.message;

  console.log(err);

  // Mongoose CastError
  if (err.name === "CastError") {
    error = new Error("Resource not found") as CustomError;
    error.statusCode = 404;
  }

  // Duplicate key error
  if (err.code === 11000) {
    error = new Error("Duplicate value entered") as CustomError;
    error.statusCode = 400;
  }

  // Validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors || {})
      .map((val: any) => val.message)
      .join(", ");

    error = new Error(message) as CustomError;
    error.statusCode = 400;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

export default errorMiddleware;