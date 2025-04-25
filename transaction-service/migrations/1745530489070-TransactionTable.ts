import { MigrationInterface, QueryRunner } from "typeorm";

export class TransactionTable1745530489070 implements MigrationInterface {
    name = 'TransactionTable1745530489070'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transactions-type" ("transactionTypeId" SERIAL NOT NULL, "transactionTypeName" character varying NOT NULL, CONSTRAINT "PK_51b4eef6ec302c76f5be3f983b3" PRIMARY KEY ("transactionTypeId"))`);
        await queryRunner.query(`CREATE TABLE "transactions" ("transactionExternalId" uuid NOT NULL DEFAULT uuid_generate_v4(), "accountExternalIdDebit" character varying NOT NULL, "accountExternalIdCredit" character varying NOT NULL, "value" numeric(10,2) NOT NULL, "transactionStatus" character varying NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "transactionTypeId" integer, CONSTRAINT "PK_32868309eb594c55b7e9797f75a" PRIMARY KEY ("transactionExternalId"))`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_13ec2f6f02ddbb52a02ab867156" FOREIGN KEY ("transactionTypeId") REFERENCES "transactions-type"("transactionTypeId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_13ec2f6f02ddbb52a02ab867156"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TABLE "transactions-type"`);
    }

}
