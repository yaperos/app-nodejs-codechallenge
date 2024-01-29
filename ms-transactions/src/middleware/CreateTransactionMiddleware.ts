import { CreateTransactionRequest } from '../requests/CreateTransactionRequest';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { createTransactionValidator } from '../validators/createTransaction.validator';

export const CreateTransactionMiddleware: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body as CreateTransactionRequest;
    const validated = createTransactionValidator.validate(body);

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
