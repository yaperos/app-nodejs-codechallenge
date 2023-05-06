import { TransactionStatus } from 'src/transaction-status/entities/transaction-status.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class TransactionStatusSeeder1683318885 implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const transactionStatusRepository =
      dataSource.getRepository(TransactionStatus);

    const newStatus = transactionStatusRepository.create([
      {
        name: 'pending',
      },
      {
        name: 'approved',
      },
      {
        name: 'rejected',
      },
    ]);

    await transactionStatusRepository.save(newStatus);
  }
}
