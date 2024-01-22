import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1705894660588 implements MigrationInterface {
  name = 'Migration1705894660588';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."transaction_status_enum" AS ENUM('pending', 'approved', 'rejected')
        `);
    await queryRunner.query(`
            CREATE TABLE "transaction" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "account_external_id_debit" character varying NOT NULL,
                "account_external_id_credit" character varying NOT NULL,
                "value" numeric(10, 2) NOT NULL,
                "status" "public"."transaction_status_enum" NOT NULL DEFAULT 'pending',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "transaction"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."transaction_status_enum"
        `);
  }
}
