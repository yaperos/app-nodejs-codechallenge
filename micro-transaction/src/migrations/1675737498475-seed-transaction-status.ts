import { MigrationInterface, QueryRunner } from 'typeorm';
import { TransactionStatusEntity } from '../transaction-status/entities/transaction-status.entity';
import { TransactionStatusConstant } from '../transaction-status/constants/transaction-status.constant';

export class seedTransactionStatus1675737498475 implements MigrationInterface {
  name = 'seedTransactionStatus1675737498475';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(
      TransactionStatusEntity,
      TransactionStatusConstant.getListStatus(),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE * FROM ?', [
      TransactionStatusConstant.tableName,
    ]);
  }
}
