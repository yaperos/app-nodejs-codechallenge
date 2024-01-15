import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { TransactionType } from '../entities/transaction-type.entity';

export default class TransactionTypeSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const data = dataSource.getRepository(TransactionType);
    await data.insert([
      {
        name: 'loan',
      },
      {
        name: 'deposit',
      },
      {
        name: 'pay',
      },
    ]);
  }
}
