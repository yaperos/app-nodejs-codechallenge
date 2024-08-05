import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { TransactionStatusModel } from '../models/status.model';

export default class StatusSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const data = dataSource.getRepository(TransactionStatusModel);
    await data.insert([
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
  }
}
