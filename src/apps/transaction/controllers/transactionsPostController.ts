import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { CommandBus } from '../../../contexts/shared/domain/commandBus';
import { CreateTransactionCommand } from '../../../contexts/transaction/transactions/domain/createTransactionCommand';
import { Controller } from './controller';

interface CreateTransactionRequest extends Request {
	body: {
		accountExternalIdDebit: string;
		accountExternalIdCredit: string;
		tranferTypeId: number;
		value: number;
	};
}

export class TransactionsPostController implements Controller {
	constructor(private readonly commandBus: CommandBus) {}

	async run(req: CreateTransactionRequest, res: Response): Promise<void> {
		const createTransactionCommand = new CreateTransactionCommand({
			accountExternalIdDebit: req.body.accountExternalIdDebit,
			accountExternalIdCredit: req.body.accountExternalIdCredit,
			tranferTypeId: req.body.tranferTypeId,
			value: req.body.value
		});

		await this.commandBus.dispatch(createTransactionCommand);
		res.status(httpStatus.OK).send();
	}
}
