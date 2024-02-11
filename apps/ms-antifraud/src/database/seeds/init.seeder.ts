import { DataSource } from "typeorm";
import { runSeeders, Seeder } from "typeorm-extension";
import TransactionTypeSeeder from "./transaction-type.seeder";
import TransactionStatusSeeder from "./transaction-status.seeder";

export default class InitSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
  ): Promise<any> {
    await runSeeders(dataSource, {
      seeds: [TransactionTypeSeeder, TransactionStatusSeeder],
    })
  }
}
