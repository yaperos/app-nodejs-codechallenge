import { MigrationInterface, QueryRunner } from 'typeorm';

export class INSERTTRANSACTIONSTATUS1704254221804
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO transaction_status (name, createdAt, updatedAt)
        VALUES
          ('pending', NOW(), NOW()),
          ('approved', NOW(), NOW()),
          ('rejected', NOW(), NOW());
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DELETE FROM transaction_status
        WHERE name IN ('pending', 'approved', 'rejected');
      `);
  }
}
