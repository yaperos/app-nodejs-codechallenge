import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { CustomError } from "../../domain/entities/custom-error";

export const errorHandler: ErrorRequestHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.httpCode).json({ statusCode: err.httpCode, errorMessage: err.message });
};