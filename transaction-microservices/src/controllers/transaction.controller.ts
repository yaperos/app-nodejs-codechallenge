import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Id } from 'objection';
import { v4 as uuidv4 } from 'uuid';
import { Transaction } from '../models';
import ProducerFactory from '../bootstrap/producer.kafka';
import { TransactionResource } from '../resources/transaction.resource';
import { config } from '../config';
import { TransactionDTO } from '../dto/transaction.dto';

const producerFactory = new ProducerFactory(config.kafkaTopicTransaction);

export const get = async (req: Request, res: Response): Promise<Response> => {
  const externalId: Id = req.params.id;
  const transaction = await Transaction.query().where({transactionExternalId: externalId}).first();
  if (transaction) {
    const response =  await TransactionResource(transaction);
    return res.status(StatusCodes.OK).json(response);
  }
  return res.sendStatus(StatusCodes.NOT_FOUND);
};

export const create = async ( req: Request, res: Response): Promise<Response> => {
  const transactionDto = TransactionDTO(req);
  const transaction = await Transaction.query().insert(transactionDto).returning('*');
  await producerFactory.send(transaction);
  return res.status(StatusCodes.CREATED).json(await TransactionResource(transaction));
};

export const TransactionController = {
  get,
  create
};
