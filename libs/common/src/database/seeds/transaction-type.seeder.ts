import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';

export default class TransactionTypeSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    await dataSource.query(`
      INSERT INTO transaction_types(id, name) VALUES 
      (1, 'Payroll payments'),
      (2, 'Pension payments'),
      (3, 'Expense reimbursement');
    `);
  }
}
