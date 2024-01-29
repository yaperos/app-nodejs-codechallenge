import { Transaction } from '../models/Transaction';
import { Request, RequestHandler, Response } from 'express';
import { CreateTransactionRequest } from '../requests/CreateTransactionRequest';
import { TransactionEntity } from '../database/entities/TransactionEntity';
import { StatusEntity } from '../database/entities/StatusEntity';
import { TypeEntity } from '../database/entities/TypeEntity';
import { TransactionResponse } from '../responses/TransactionResponse';
import { KafkaProducer } from '../services/kafka/KafkaProducer';
import { redisConfig } from '../cache/redisConfig';

export const createTransaction: RequestHandler = async (
  request: Request,
  response: Response
) => {
  const body = request.body as CreateTransactionRequest;
  const transactionModel = Transaction.fromRequest(body);

  const status = await StatusEntity.findByPk(
    transactionModel.transactionStatus
  );

  if (!status) {
    return response
      .status(400)
      .send({ status: false, message: "status doesn't exist!" });
  }

  const type = await TypeEntity.findByPk(transactionModel.transactionType);

  if (!type) {
    return response
      .status(400)
      .send({ status: false, message: "type doesn't exist!" });
  }

  const entity = await TransactionEntity.create({
    accountExternalIdDebit: transactionModel.accountExternalIdDebit,
    accountExternalIdCredit: transactionModel.accountExternalIdCredit,
    typeId: transactionModel.transactionType,
    statusId: transactionModel.transactionStatus,
    value: transactionModel.value
  });

  const entityFind = await TransactionEntity.findByPk(
    entity.transactionExternalId,
    { include: [StatusEntity, TypeEntity] }
  );

  if (entityFind) {
    const producer = new KafkaProducer(
      KafkaProducer.TOPIC_ANTIFRAUD_VALIDATION
    );

    await producer.emit({
      transactionExternalId: entityFind.transactionExternalId,
      value: entityFind.value
    });

    response.status(200).send({
      status: true,
      data: TransactionResponse.fromEntity(entityFind),
      message: 'Transaction created successfully'
    });
  } else {
    response.json(500).send({ status: false, message: 'something was wrong!' });
  }
};

export const getTransaction: RequestHandler = async (
  request: Request,
  response: Response
) => {
  redisConfig.on('error', (err) => console.log('Redis Client Error', err));

  try {
    await redisConfig.connect();
    const getCacheResult = await redisConfig.get(
      request.params.transactionExternalId
    );
    if (getCacheResult) {
      return response.status(200).send({
        status: true,
        data: TransactionResponse.fromEntity(JSON.parse(getCacheResult))
      });
    }
    const transaction = await TransactionEntity.findByPk(
      request.params.transactionExternalId,
      {
        include: [TypeEntity, StatusEntity]
      }
    );

    if (transaction) {
      const saveResultRedis = await redisConfig.set(
        transaction.transactionExternalId,
        JSON.stringify(transaction)
      );
      console.log('New data cached ', saveResultRedis);
      return response.status(200).send({
        status: true,
        data: TransactionResponse.fromEntity(transaction)
      });
    } else {
      return response
        .status(404)
        .send({ status: true, data: {}, message: 'transaction not found!' });
    }
  } catch (e) {
    console.log(e);
    return response.status(500).json({ message: 'Internal server error' });
  } finally {
    await redisConfig.quit();
  }
};
