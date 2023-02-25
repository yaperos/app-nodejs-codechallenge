import { NextFunction, Request, Response } from 'express';
import { GeneralError } from '../utils/error.util';
import { HTTP_STATUS } from '../constants/http-status.constant';

// handle not found errors
export const notFound = (req, res, next) => {
  res.status(HTTP_STATUS.NOT_FOUND);
  res.json({
    message: 'Requested resource not found',
  });
  res.end();
};

// handle internal server errors
export const internalServerError = (err, req, res, next) => {
  res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR);
  res.json({
    message: err.message,
    extra: err.extra,
    errors: err,
  });
  res.end();
};

export const catchError = (ftn: (rq: Request, rs: Response, nx?: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    return ftn(req, res, next).catch((err: GeneralError | any) => {
      next(err);
    });
  };
};

export const errorHandler = (err: GeneralError | any, req: Request, res: Response, next: NextFunction) => {
  const statusCode: number = err instanceof GeneralError ? err.statusCode : HTTP_STATUS.INTERNAL_SERVER_ERROR;
  res.status(statusCode).json({
    statusText: HTTP_STATUS[statusCode] || HTTP_STATUS[HTTP_STATUS.INTERNAL_SERVER_ERROR],
    messsage: err.message || HTTP_STATUS[`${statusCode}_MESSAGE`],
  });
};

export const throwBusinessError = (message: any = '') => {
  throw new GeneralError(HTTP_STATUS.BUSINESS_ERROR, message);
};

export const throwDBError = (message: any = '') => {
  throw new GeneralError(HTTP_STATUS.DB_ERROR, message);
};

export const throwInternalServerError = (message: any = '') => {
  throw new GeneralError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message);
};
