import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1690721283694 implements MigrationInterface {
  name = 'Migration1690721283694';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."transaction_status_status_enum" AS ENUM('pending', 'approved', 'rejected')`,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction_status" ("id" SERIAL NOT NULL, "status" "public"."transaction_status_status_enum" NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_05fbbdf6bc1db819f47975c8c0b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."transaction_type_type_enum" AS ENUM('Transfer', 'Pay', 'Credit', 'Discount')`,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction_type" ("id" SERIAL NOT NULL, "type" "public"."transaction_type_type_enum" NOT NULL DEFAULT 'Transfer', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e4e15bcea926d360cfeea703c36" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "financial_transactions" ("id" SERIAL NOT NULL, "value" integer NOT NULL DEFAULT '0', "account_external_id_debit" character varying NOT NULL, "account_external_id_credit" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "delete_at" TIMESTAMP, "status_id" integer, "type_id" integer, CONSTRAINT "PK_3f0ffe3ca2def8783ad8bb5036b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_91f0ffe834adc103eb13d67bab" ON "financial_transactions" ("status_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_0b284717a2bd6dd425425e8f3f" ON "financial_transactions" ("type_id") `);
    await queryRunner.query(
      `ALTER TABLE "financial_transactions" ADD CONSTRAINT "FK_91f0ffe834adc103eb13d67bab4" FOREIGN KEY ("status_id") REFERENCES "transaction_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_transactions" ADD CONSTRAINT "FK_0b284717a2bd6dd425425e8f3f9" FOREIGN KEY ("type_id") REFERENCES "transaction_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "financial_transactions" DROP CONSTRAINT "FK_0b284717a2bd6dd425425e8f3f9"`);
    await queryRunner.query(`ALTER TABLE "financial_transactions" DROP CONSTRAINT "FK_91f0ffe834adc103eb13d67bab4"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_0b284717a2bd6dd425425e8f3f"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_91f0ffe834adc103eb13d67bab"`);
    await queryRunner.query(`DROP TABLE "financial_transactions"`);
    await queryRunner.query(`DROP TABLE "transaction_type"`);
    await queryRunner.query(`DROP TYPE "public"."transaction_type_type_enum"`);
    await queryRunner.query(`DROP TABLE "transaction_status"`);
    await queryRunner.query(`DROP TYPE "public"."transaction_status_status_enum"`);
  }
}
