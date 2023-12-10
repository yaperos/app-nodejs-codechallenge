import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTransaction1702091029272 implements MigrationInterface {
  name = 'CreateTransaction1702091029272';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "transactions" ("transaction_external_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" integer NOT NULL, "status" character varying(30) NOT NULL DEFAULT 'PENDING', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "transactionTypeId" integer, CONSTRAINT "PK_4b34e695642d9991e8c82daac5c" PRIMARY KEY ("transaction_external_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_13ec2f6f02ddbb52a02ab867156" FOREIGN KEY ("transactionTypeId") REFERENCES "transaction_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_13ec2f6f02ddbb52a02ab867156"`,
    );
    await queryRunner.query(`DROP TABLE "transactions"`);
  }
}
