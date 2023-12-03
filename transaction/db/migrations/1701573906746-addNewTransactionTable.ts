import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewTransactionTable1701573906746 implements MigrationInterface {
	public name = 'AddNewTransactionTable1701573906746';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "transaction" (
                "id" SERIAL NOT NULL, 
                "transaction_external_id" character varying(36) NOT NULL, 
                "account_external_id_debit" character varying(36) NOT NULL, 
                "account_external_id_credit" character varying(36) NOT NULL, 
                "tranfer_type_id" integer NOT NULL, 
                "transaction_type" character varying NOT NULL, 
                "transaction_status" character varying NOT NULL, 
                "value" numeric NOT NULL, 
                "created_at" TIMESTAMP NOT NULL, 
                "update_at" TIMESTAMP NOT NULL,
                CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE "transaction"`);
	}
}
