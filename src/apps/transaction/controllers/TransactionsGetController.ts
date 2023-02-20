import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { QueryBus } from '../../../Contexts/Shared/domain/QueryBus';
import { TransactionResponse } from '../../../Contexts/Transaction/Transactions/application/TransactionResponse';
import { FindTransactionQuery } from '../../../Contexts/Transaction/Transactions/domain/FindTransactionQuery';
import { TransactionNotExist } from '../../../Contexts/Transaction/Transactions/domain/TransactionNotExist';
import { Controller } from './Controller';

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
