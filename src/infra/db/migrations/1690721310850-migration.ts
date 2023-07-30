import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1690721310850 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO transaction_status(status) VALUES ('pending'), ('approved'), ('rejected')`);
    await queryRunner.query(
      `INSERT INTO transaction_type(type) VALUES ('Transfer'), ('Pay'), ('Credit'), ('Discount')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM transaction_status WHERE status IN ('pending', 'approved', 'rejected')`);
    await queryRunner.query(`DELETE FROM transaction_type WHERE type IN ('Transfer', 'Pay', 'Credit', 'Discount')`);
  }
}
