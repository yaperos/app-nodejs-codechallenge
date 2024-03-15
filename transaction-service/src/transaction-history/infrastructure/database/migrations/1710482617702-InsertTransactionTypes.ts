import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertTransactionTypes1710482617702 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO transaction_catalog (name, type) VALUES ('CREDIT', 'TRANSACTION_TYPE');`,
    );
    await queryRunner.query(
      `INSERT INTO transaction_catalog (name, type) VALUES ('DEBIT', 'TRANSACTION_TYPE');`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM transaction_catalog tc WHERE tc.name in ('CREDIT', 'DEBIT');`,
    );
  }
}
