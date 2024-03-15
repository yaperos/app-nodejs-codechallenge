import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertTransactionStatus1710482965695
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO transaction_catalog (name, type) VALUES ('PENDING', 'TRANSACTION_STATUS');`,
    );
    await queryRunner.query(
      `INSERT INTO transaction_catalog (name, type) VALUES ('APPROVED', 'TRANSACTION_STATUS');`,
    );
    await queryRunner.query(
      `INSERT INTO transaction_catalog (name, type) VALUES ('REJECTED', 'TRANSACTION_STATUS');`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM transaction_catalog tc WHERE tc.name in ('PENDING', 'APPROVED', 'REJECTED');`,
    );
  }
}
