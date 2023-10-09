import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { QueryBus } from '../../../contexts/shared/domain/queryBus';
import { TransactionResponse } from '../../../contexts/transaction/transactions/application/transactionResponse';
import { FindTransactionQuery } from '../../../contexts/transaction/transactions/domain/findTransactionQuery';
import { TransactionNotExist } from '../../../contexts/transaction/transactions/domain/transactionNotExist';
import { Controller } from './controller';

export interface FindTransactionRequest extends Request {
	params: {
		id: string;
	};
}

export class TransactionGetController implements Controller {
	constructor(private readonly queryBus: QueryBus) {}

	async run(req: FindTransactionRequest, res: Response): Promise<void> {
		try {
			const query = new FindTransactionQuery(req.params.id);
			const transaction = await this.queryBus.ask<TransactionResponse>(query);
			res.status(httpStatus.OK).send(transaction);
		} catch (e) {
			if (e instanceof TransactionNotExist) {
				res.status(httpStatus.NOT_FOUND).send();
			} else {
				res.status(httpStatus.INTERNAL_SERVER_ERROR).send();
			}
		}
	}
}
