import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { CommandBus } from '../../../contexts/shared/domain/commandBus';
import { CreateTransactionCommand } from '../../../contexts/transaction/transactions/domain/createTransactionCommand';
import { Controller } from './controller';

export interface CreateTransactionRequest extends Request {
  params: {
		id: string;
	};
	body: {
    id: string;
		accountExternalIdDebit: string;
		accountExternalIdCredit: string;
		tranferTypeId: number;
		value: number;
	};
}

export class TransactionsPutController implements Controller {
	constructor(private readonly commandBus: CommandBus) {}

	async run(req: CreateTransactionRequest, res: Response): Promise<void> {
    try {
      const createTransactionCommand = new CreateTransactionCommand({
        id: req.params.id,
        accountExternalIdDebit: req.body.accountExternalIdDebit,
        accountExternalIdCredit: req.body.accountExternalIdCredit,
        tranferTypeId: req.body.tranferTypeId,
        value: req.body.value
      });

      await this.commandBus.dispatch(createTransactionCommand);
      res.status(httpStatus.CREATED).send();
    } catch (e) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send();
    }

	}
}
