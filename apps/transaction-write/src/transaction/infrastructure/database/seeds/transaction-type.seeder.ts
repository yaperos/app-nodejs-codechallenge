import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { TransactionTypeModel } from '../models/transaction-type.model';

export default class TransactionTypeSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const data = dataSource.getRepository(TransactionTypeModel);
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
