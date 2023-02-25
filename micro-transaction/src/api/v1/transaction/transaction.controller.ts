import { Request, Response } from 'express';

import { BadRequest, NotAuth, NotFound, Ok } from '../../../helpers/http.helper';
import { to } from '../../../utils';
import { transactionValidate } from './transaction.validate';
import BaseController from '../base.controller';
import Transaction from './transaction.model';
import { mappearRequestTrasactionToBD } from './transaction.mapper';
import { throwBusinessError } from '../../../helpers/error.helper';
import { yapeTaskProducer } from '../../../kafka/kafka.producer';


export default class TransactionController extends BaseController  {

  constructor() {
    super(Transaction);
  }

  public async crearTransaction(req: Request, res: Response) {
    const { body } = req;
    const { error } = transactionValidate(body);
    if (error) {
      return BadRequest(res, { message: error.details[0].message });
    }

    const transactionSave = mappearRequestTrasactionToBD( body );
    const transactionBd = new Transaction( transactionSave );

    
    const [errorCrear, transactionCreated] = await to(transactionBd.save());
    if (errorCrear) {
      throwBusinessError(errorCrear);
    }

    yapeTaskProducer( transactionCreated );

    return Ok(res, transactionCreated);
  }

  public async obtenerTransactionPorId(req: Request, res: Response) {
    const { transactionId } = req.params;
    
    const [errorCrear, transactionCreated] = await to(
      Transaction.findOne({transactionExternalId: transactionId}).exec()
    );
    if (errorCrear) {
      throwBusinessError(errorCrear);
    }

    return Ok(res, transactionCreated);
  }

}
