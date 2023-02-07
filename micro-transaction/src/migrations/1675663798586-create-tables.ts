import {
  Migration,
  MigrationExecutor,
  MigrationInterface,
  QueryRunner,
} from 'typeorm';

export class createTables1675663798586 implements MigrationInterface {
  name = 'createTables1675663798586';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "transactions_types" ("id_transaction_type" integer NOT NULL, "name" character varying(100) NOT NULL, "key" character varying(100) NOT NULL, "description" character varying(250) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_c1dde9c3911aa8648b2d487cf31" UNIQUE ("key"), CONSTRAINT "PK_672b82838d65d1e711bed00675d" PRIMARY KEY ("id_transaction_type"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "transactions_status" ("id_transaction_status" integer NOT NULL, "key" character varying(100) NOT NULL, "name" character varying(100) NOT NULL, "description" character varying(250) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_6cf2142b4b00063fc8647c08b44" UNIQUE ("name"), CONSTRAINT "PK_f8d434ff35b47ddd2dc7fbc49b9" PRIMARY KEY ("id_transaction_status"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "transactions" ("id_transaction" SERIAL NOT NULL, "account_external_id_debit" uuid NOT NULL, "account_external_id_credit" uuid NOT NULL, "transfer_type_id" integer NOT NULL, "value" double precision NOT NULL, "transfer_status_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9c4c395f2216da23783a980d0dc" PRIMARY KEY ("id_transaction"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "transactions"`);
    await queryRunner.query(`DROP TABLE "transactions_status"`);
    await queryRunner.query(`DROP TABLE "transactions_types"`);
  }
}
