import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
const TRANSFER_TYPE_IDS = [1, 2];

@Injectable()
export class TransactionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const {
      accountExternalIdDebit,
      accountExternalIdCredit,
      value,
      tranferTypeId,
    } = req.body;
    if (
      typeof accountExternalIdDebit === 'string' &&
      typeof accountExternalIdCredit === 'string' &&
      typeof value === 'number' &&
      Number.isInteger(tranferTypeId) &&
      TRANSFER_TYPE_IDS.includes(tranferTypeId)
    ) {
      return next();
    }

    res
      .status(HttpStatus.BAD_REQUEST)
      .send(
        'The provided fields are not valid or are missing required information.',
      );
  }
}