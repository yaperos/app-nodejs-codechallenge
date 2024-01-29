import { NextFunction, Request, RequestHandler, Response } from 'express';
import { getTransactionValidator } from '../validators/getTransaction.validator';

export const GetTransactionMiddleware: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validated = getTransactionValidator.validate(req.params);

    if (validated.error) {
      console.error('error', validated.error);
      res.status(400).json({
        message: validated.error.message
      });
    } else {
      next();
    }
  } catch (e: any) {
    console.log(e.message);
    if (e.isJoi) {
      return res.status(422).json({ message: e.message });
    }
    return res.status(500);
  }
};
