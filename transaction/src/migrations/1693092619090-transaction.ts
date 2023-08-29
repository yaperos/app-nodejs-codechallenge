import { MigrationInterface, QueryRunner } from 'typeorm';

export class Transaction1693092619090 implements MigrationInterface {
  name = 'Transaction1693092619090';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."transactions_status_enum" AS ENUM('pending', 'approved', 'rejected')`,
    );
    await queryRunner.query(
      `CREATE TABLE "transactions" ("transactionExternalId" uuid NOT NULL DEFAULT uuid_generate_v4(), "accountExternalIdDebit" uuid NOT NULL, "accountExternalIdCredit" uuid NOT NULL, "transferTypeId" integer NOT NULL, "value" double precision NOT NULL, "status" "public"."transactions_status_enum" NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_32868309eb594c55b7e9797f75a" PRIMARY KEY ("transactionExternalId"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_33817a7fe9068146f113ddabbf9" FOREIGN KEY ("accountExternalIdDebit") REFERENCES "users_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_4edbb417da33f54fb411fe50349" FOREIGN KEY ("accountExternalIdCredit") REFERENCES "users_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_3ddc6ffafc14c073e19c36742aa" FOREIGN KEY ("transferTypeId") REFERENCES "transfers_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_3ddc6ffafc14c073e19c36742aa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_4edbb417da33f54fb411fe50349"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_33817a7fe9068146f113ddabbf9"`,
    );
    await queryRunner.query(`DROP TABLE "transactions"`);
    await queryRunner.query(`DROP TYPE "public"."transactions_status_enum"`);
  }
}
