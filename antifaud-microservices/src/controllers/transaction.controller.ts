import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Id } from 'objection';
import { User } from '../models';
import ProducerFactory from '../bootstrap/producer.kafka';

const producerFactory = new ProducerFactory();
producerFactory.start();

export const get = async (req: Request, res: Response): Promise<Response> => {
  producerFactory.send({a:'test1 antifraud'});
  return res.sendStatus(StatusCodes.OK);
};

export const create = async ( req: Request, res: Response): Promise<Response> => {
  return res.sendStatus(StatusCodes.OK);
};

export const TransactionController = {
  get,
  create
};
