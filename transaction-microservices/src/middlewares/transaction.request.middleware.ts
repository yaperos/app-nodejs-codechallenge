import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes';

export const TransactionRequest = (req:Request, res:Response, next: NextFunction) => {
  const error:any = {};
  if (!req.body.accountExternalIdDebit) {
    error.accountExternalIdDebit = 'accountExternalIdDebit is required'
  }
  if (!req.body.accountExternalIdCredit) {
    error.accountExternalIdCredit = 'accountExternalIdCredit is required'
  }
  if (!req.body.tranferTypeId) {
    error.tranferTypeId = 'tranferTypeId is required'
  }
  if (!req.body.value) {
    error.value = 'value is required'
  }
  if (Object.keys(error).length > 0) {
    return res.status(StatusCodes.BAD_REQUEST).json(error);
  }
  next()
}
