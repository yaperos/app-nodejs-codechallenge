
import {  Context } from 'aws-lambda';
import { CreateTransactionUseCase } from '../../application/use-cases/create-transaction.usecase';
import { GetTransactionUseCase } from '../../application/use-cases/get-transaction.usecase';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { INestApplicationContext } from '@nestjs/common';


let app: INestApplicationContext;

export const handler = async (event: any, context: Context) => {

  if (!app) {
    app = await NestFactory.createApplicationContext(AppModule, {
      logger: false,
    });
  }

  const createUseCase = app.get(CreateTransactionUseCase);
  const getUseCase = app.get(GetTransactionUseCase);


  const fieldName = event.info.fieldName;

  switch (fieldName) {
    case 'createTransaction': {
      const args = event.arguments;
      return await createUseCase.execute({
        accountExternalIdDebit: args.accountExternalIdDebit,
        accountExternalIdCredit: args.accountExternalIdCredit,
        transferTypeId: args.transferTypeId,
        value: args.value,
      });
    }

    case 'getTransaction': {
      const { transactionExternalId } = event.arguments;
      return await getUseCase.execute(transactionExternalId);
    }

    default:
      throw new Error(`Unknown field: ${fieldName}`);
  }
};
