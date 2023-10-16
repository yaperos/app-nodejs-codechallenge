import { DataSource } from 'typeorm';
import { runSeeders, Seeder, SeederFactoryManager } from 'typeorm-extension';
import UserSeeder from './seeds/user.seeder';
import UserCardSeeder from './seeds/user-card.seeder';
import CardTypeSeeder from './seeds/card-type.seeder';

export default class InitSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    await runSeeders(dataSource, {
      seeds: [UserSeeder, CardTypeSeeder, UserCardSeeder],
      // factories: [userFactory],
    });
  }
}
