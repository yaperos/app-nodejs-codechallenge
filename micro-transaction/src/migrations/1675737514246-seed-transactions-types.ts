import { MigrationInterface, QueryRunner } from 'typeorm';
import { TransactionTypeEntity } from '../transaction-type/entities/transaction-type.entity';
import { TransactionTypesConstant } from '../transaction-type/constants/transaction-type.constant';

export class seedTransactionsTypes1675737514246 implements MigrationInterface {
  name = 'seedTransactionsTypes1675737514246';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(
      TransactionTypeEntity,
      TransactionTypesConstant.getListTransactionsTypes(),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE * FROM ?', [
      TransactionTypesConstant.tableName,
    ]);
  }
}
