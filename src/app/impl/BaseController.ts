import Transaction from '@context/transactions/domain/class/Transaction';
import {NextFunction, Response} from 'express';

export interface BaseController {
  run(req: Transaction, res: Response, next: NextFunction): Promise<any>;
}
