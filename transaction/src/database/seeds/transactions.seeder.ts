import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { TransactionStatus } from '../../models/transaction-status.model';
import { TransactionType } from '../../models/transaction-type.model';
import { TransactionStatusCodeEnum, TransactionStatusEnum, TransactionTypeEnum } from '../../types';

export default class TransactionStatusSeeder implements Seeder {
    public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const transactionStatusRepository = dataSource.getRepository(TransactionStatus);
    const transactionTypeRepository = dataSource.getRepository(TransactionType);
    
    await dataSource.query('DELETE FROM "TransactionStatus";');
    await dataSource.query('DELETE FROM "TransactionType";');

    await transactionStatusRepository.save([
      { name: TransactionStatusEnum.PENDING, code: TransactionStatusCodeEnum.PENDING },
      { name: TransactionStatusEnum.APPROVED, code: TransactionStatusCodeEnum.APPROVED },
      { name: TransactionStatusEnum.REJECTED, code: TransactionStatusCodeEnum.REJECTED },
    ]);

    await transactionTypeRepository.save([ 
        { name: TransactionTypeEnum.EXTERNAL },
        { name: TransactionTypeEnum.INTERNAL },
    ])

  } 
}