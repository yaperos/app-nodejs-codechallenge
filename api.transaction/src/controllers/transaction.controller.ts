import { Request, Response } from 'express';
import { route, GET, POST, PUT } from 'awilix-express';
import { ObjectId } from 'mongodb';

import { TransactionFindByIdQuery } from '../services/queries/transaction-find-by-id.query';
import {
  TransactionCreateCommand,
  TransactionCreateCommandInput,
} from '../services/commands/transaction-create.command';
import {
  TransactionUpdateStatus,
  TransactionUpdateStatusCommandInput,
} from '../services/commands/transaction-update-status.command';

@route('/transactions')
export default class TransactionController {
  constructor(
    private readonly transactionFindByIdQuery: TransactionFindByIdQuery,
    private readonly transactionCreateCommand: TransactionCreateCommand,
    private readonly transactionUpdateStatus: TransactionUpdateStatus,
  ) {}

  @route('/:id')
  @GET()
  async findById(req: Request, res: Response) {
    const id = ObjectId.createFromHexString(req.params.id);
    const result = await this.transactionFindByIdQuery.handle(id);

    if (result) {
      res.send(result);
    } else {
      res.status(404);
      res.send(`Transaction: ${id} could not be found`);
    }
  }

  @route('/')
  @POST()
  async create(
    req: Request<unknown, unknown, TransactionCreateCommandInput>,
    res: Response,
  ) {
    const transactionId = await this.transactionCreateCommand.handle(req.body);

    res.status(201);
    res.send({
      transactionId,
    });
  }

  @route('/:id')
  @PUT()
  async update(
    req: Request<{ id: string }, unknown, TransactionUpdateStatusCommandInput>,
    res: Response,
  ) {
    await this.transactionUpdateStatus.handle(
      ObjectId.createFromHexString(req.params.id),
      req.body,
    );

    res.status(204);
    res.send();
  }
}
