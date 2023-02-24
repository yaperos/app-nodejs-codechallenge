import * as dotenv from 'dotenv';
import { TransactionStatusEnum, TransactionTypeEnum } from '../common';
import { TransactionStatus, TransactionType } from '../entities';
import { DataSource } from 'typeorm';
import { DatabaseConfig } from './database.config';
dotenv.config();

async function seedInitialValues() {
  const datasource = new DataSource(DatabaseConfig.get);
  await datasource.initialize();

  await datasource.transaction(async (manager) => {
    const transactionStatusRepository =
      manager.getRepository(TransactionStatus);
    const transactionTypeRepository = manager.getRepository(TransactionType);

    await transactionStatusRepository.save([
      {
        id: 1,
        name: TransactionStatusEnum.PENDING,
      },
      {
        id: 2,
        name: TransactionStatusEnum.APPROVED,
      },
      {
        id: 3,
        name: TransactionStatusEnum.REJECTED,
      },
    ]);

    await transactionTypeRepository.save([
      {
        id: 1,
        name: TransactionTypeEnum.TYPE_1,
      },
      {
        id: 2,
        name: TransactionTypeEnum.TYPE_2,
      },
      { id: 3, name: TransactionTypeEnum.TYPE_3 },
    ]);
  });
}

seedInitialValues()
  .then(() => {
    console.log('SEED DONE');
    process.exit();
  })
  .catch((error) => {
    console.log(error.message);
    console.log('SEED FAILURE');
    process.exit();
  });
