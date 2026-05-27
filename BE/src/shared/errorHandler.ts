import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorsModel.js";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  console.error(err); // log para depuración
  return res.status(500).json({
    success: false,
    message: "Error interno del servidor",
  });
};