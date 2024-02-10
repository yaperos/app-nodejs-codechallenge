import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { TransactionStatus } from '../entities/transaction-status.entity';

export default class TransactionStatusSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
  ): Promise<any> {
    const repository =  dataSource.getRepository(TransactionStatus);
    await Promise.all([
      repository.save({ name: 'pending' }),
      repository.save({ name: 'approved' }),
      repository.save({ name: 'rejected' }),
    ]);
  }
}
