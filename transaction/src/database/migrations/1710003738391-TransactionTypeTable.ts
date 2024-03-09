import { MigrationInterface, QueryRunner } from "typeorm";

export class TransactionTypeTable1710003738391 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `
        INSERT INTO transaction_type (name)
        VALUES ('PIX'), 
          ('TED'), 
          ('Debit'),
          ('Credit');
      `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `
        DELETE FROM transaction_type;
        ALTER SEQUENCE transaction_type_id_seq RESTART WITH 1;
      `
    )
  }

}
