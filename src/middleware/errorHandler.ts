import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../error";

export const errorHandler = (
  error: any,
  _: Request,
  res: Response,
  __: NextFunction
): void => {
  if (error instanceof BadRequestError) {
    res.status(error.httpStatus).json({
      message: error.message,
      ...(error.data ? { data: error.data } : {}),
    });
    return;
  }

  res.status(500);
  res.render("error", { error });
  return;
};
