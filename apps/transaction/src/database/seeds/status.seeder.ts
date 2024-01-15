import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { TransactionStatus } from '../entities/status.entity';

export default class StatusSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const data = dataSource.getRepository(TransactionStatus);
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
