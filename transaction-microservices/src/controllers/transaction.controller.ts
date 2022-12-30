import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Id } from 'objection';
import { v4 as uuidv4 } from 'uuid';
import { Transaction } from '../models';
import ProducerFactory from '../bootstrap/producer.kafka';
import { TransactionResource } from '../resources/transaction.resource';

const producerFactory = new ProducerFactory();
producerFactory.start();

export const get = async (req: Request, res: Response): Promise<Response> => {
  const externalId: Id = req.params.id;
  const transaction = await Transaction.query().where({transactionExternalId: externalId}).first();
  if (transaction) {
    // @ts-ignore
    return res.status(StatusCodes.OK).json(await TransactionResource(transaction));
  }
  return res.sendStatus(StatusCodes.NOT_FOUND);
};

export const create = async ( req: Request, res: Response): Promise<Response> => {
  const body = req.body;
  body.transactionExternalId = uuidv4();
  const transaction = await Transaction.query().insert(body).returning('*');
  producerFactory.send(transaction);
  // @ts-ignore
  return res.status(StatusCodes.CREATED).json(await TransactionResource(transaction));
};

export const TransactionController = {
  get,
  create
};
