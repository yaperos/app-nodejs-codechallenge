import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager, runSeeder } from 'typeorm-extension';
import { TransactionStatusSeeder1683318885 } from './1683318885-TransactionStatus.seeder';
import { TransactionTypeSeeder1683318990 } from './1683318990-TransactionType.seeder';

export class MainSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    await runSeeder(dataSource, TransactionStatusSeeder1683318885);
    await runSeeder(dataSource, TransactionTypeSeeder1683318990);
  }
}
