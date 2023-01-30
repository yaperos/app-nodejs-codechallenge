import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Objection, { PartialModelObject } from "objection";
import { StatusInterface, TransactionCreateInterface } from '../Interfaces/transaction.interface';
import { Transaction } from "../models";

export const TransactionDTO = (req: Request): PartialModelObject<Transaction> => {
	const body:TransactionCreateInterface = req.body;
	return {
		transactionExternalId: uuidv4(),
  		accountExternalIdDebit: body.accountExternalIdDebit,
  		accountExternalIdCredit: body.accountExternalIdCredit,
  		tranferTypeId: body.tranferTypeId,
  		value: body.value,
  		status: StatusInterface.PENDING
	}
};
