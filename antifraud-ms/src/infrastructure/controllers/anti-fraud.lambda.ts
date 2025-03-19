import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { ProcessTransactionUseCase } from '../../application/use-cases/process-transaction.usecase';
import { INestApplicationContext } from '@nestjs/common';

let app: INestApplicationContext;

export const handler = async (event: any) => {
  if (!app) {
    app = await NestFactory.createApplicationContext(AppModule, {
      logger: false,
    });
  }

  const processUseCase = app.get(ProcessTransactionUseCase);
  const fieldName = event.info.fieldName;

  switch (fieldName) {
    case 'manualCheck': {
      const args = event.arguments;
      const status = await processUseCase.execute({
        transactionExternalId: args.transactionExternalId,
        value: args.value,
        accountExternalIdDebit: '',
        accountExternalIdCredit: '',
        transactionStatus: 'PENDING',
        createdAt: new Date(),
      });
      return {
        transactionExternalId: args.transactionExternalId,
        status,
      };
    }
    default:
      throw new Error(`Unknown field: ${fieldName}`);
  }
};
