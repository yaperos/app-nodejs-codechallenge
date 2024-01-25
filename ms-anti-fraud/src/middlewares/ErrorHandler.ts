import createError from "http-errors";
import { NextFunction, Request, Response } from "express";

function ErrorHandler(
  err: { status: number; message: any; type: any },
  { method, originalUrl }: Request,
  res: Response,
  _next: NextFunction
) {
  if ("status" in err) {
    console.error(
      "[ERROR:GLOBAL]",
      JSON.stringify({
        method,
        originalUrl,
        status: err.status,
        message: err.message,
        type: err.type,
      })
    );
    res.status(err.status).json(err);
  } else {
    console.error("[ERROR:GLOBAL]", { method, originalUrl, err });

    const newError = createError(500, "Internal Server Error");

    res.status(newError.status).json(newError);
  }
}

export { ErrorHandler };
