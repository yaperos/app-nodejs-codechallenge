import { MigrationInterface, QueryRunner } from "typeorm";

export class TransactionStatusTable1709932255427 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `
        INSERT INTO transaction_status (name)
        VALUES ('accepted'), 
          ('pending'), 
          ('rejected');
      `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `
        DELETE FROM transaction_status;
        ALTER SEQUENCE transaction_status_id_seq RESTART WITH 1;
      `
    )
  }

}
