import { NextFunction, Request, Response } from 'express';
import logger from '../libs/logger';
import { EventNotificator } from '../services/EventNotificator';
import { TransactionRepository } from '../contracts/transactionRepository';
import { TransactionCreatedEvent, TransactionUpdatedEvent } from '../events/TransactionEvent';
import Validator from '../facades/validator';
import { TRANSACTION_APPROVED, TRANSACTION_REJECTED } from '../constants/transaction';
import { getTransactionStatus } from '../helpers/utils';

const validateCreateTransaction = (transaction: any) => {
  const schema = {
    accountExternalIdDebit: { type: 'string', optional: true },
    accountExternalIdCredit: { type: 'string', optional: true },
    transferTypeId: { type: 'number', empty: false, trim: true },
    value: { type: 'number', empty: false, trim: true },
  };

  const validator = new Validator(schema);
  validator.validate(transaction);
};

const mapTransactionResponse = (transaction: any) => {
  return {
    id: transaction.id,
    transactionExternalId: transaction.accountExternalIdDebit || transaction.accountExternalIdCredit,
    transactionType: {
      name: transaction.accountExternalIdDebit ? 'DEBIT' : 'CREDIT',
    },
    value: transaction.value,
    transactionStatus: getTransactionStatus(transaction.statusId),
    createdAt: transaction.createdAt,
  };
};

export class TransactionController {
  repository: any;
  eventNotificator: EventNotificator;
  constructor(repository: TransactionRepository, eventNotificator: EventNotificator) {
    this.repository = repository;
    this.eventNotificator = eventNotificator;
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const model = req.body;
    try {
      logger.info('Creating transaction', { model });
      validateCreateTransaction(model);
      const transaction = await this.repository.create(model);
      this.eventNotificator.notify(new TransactionCreatedEvent(transaction));
      res.status(200).json(mapTransactionResponse(transaction));
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const transaction = await this.repository.findById(req.params.id);
      res.status(200).json(transaction);
    } catch (error) {
      next(error);
    }
  }

  async approve(req: Request, res: Response, next: NextFunction) {
    try {
      const transaction = await this.repository.update(req.params.id, { statusId: TRANSACTION_APPROVED });
      this.eventNotificator.notify(new TransactionUpdatedEvent(transaction));
      res.status(200).json(mapTransactionResponse(transaction));
    } catch (error) {
      next(error);
    }
  }

  async reject(req: Request, res: Response, next: NextFunction) {
    try {
      const transaction = await this.repository.update(req.params.id, { statusId: TRANSACTION_REJECTED });
      this.eventNotificator.notify(new TransactionUpdatedEvent(transaction));
      res.status(200).json(mapTransactionResponse(transaction));
    } catch (error) {
      next(error);
    }
  }
}
