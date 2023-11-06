import { MigrationInterface, QueryRunner } from 'typeorm';

export class transactions1699237902382 implements MigrationInterface {
  name = 'transactions1699237902382';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "transactions" ("id" SERIAL NOT NULL, "transaction_external_id" character varying NOT NULL, "transaction_type_id" integer NOT NULL, "transaction_type_name" character varying NOT NULL, "transaction_status" character varying NOT NULL, "value" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_4b34e695642d9991e8c82daac5c" UNIQUE ("transaction_external_id"), CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4b34e695642d9991e8c82daac5" ON "transactions" ("transaction_external_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "query-result-cache" ("id" SERIAL NOT NULL, "identifier" character varying, "time" bigint NOT NULL, "duration" integer NOT NULL, "query" text NOT NULL, "result" text NOT NULL, CONSTRAINT "PK_6a98f758d8bfd010e7e10ffd3d3" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "query-result-cache"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4b34e695642d9991e8c82daac5"`,
    );
    await queryRunner.query(`DROP TABLE "transactions"`);
  }
}
