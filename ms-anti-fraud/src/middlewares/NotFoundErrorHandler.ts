import { NextFunction, Request, Response } from "express";
import createError from "http-errors";

const NOT_FOUND_CODE = 404;

function NotFoundErrorHandler(req: Request, res: Response, next: NextFunction) {
  res.status(NOT_FOUND_CODE).send(createError(NOT_FOUND_CODE));
}

export { NotFoundErrorHandler };
