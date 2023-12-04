import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewTransactionTable1701652555155 implements MigrationInterface {
	public name = 'AddNewTransactionTable1701652555155';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "transaction_status" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, CONSTRAINT "UQ_bdc1017b79532763afb7872a626" UNIQUE ("name"), CONSTRAINT "PK_05fbbdf6bc1db819f47975c8c0b" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "transaction_type" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, CONSTRAINT "UQ_8705cb9b813ab0ae38cdf39c8ee" UNIQUE ("name"), CONSTRAINT "PK_e4e15bcea926d360cfeea703c36" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "transfer_type" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, CONSTRAINT "UQ_ea0322172da119442dd70d6d03d" UNIQUE ("name"), CONSTRAINT "PK_e8079532c19bb535c33902388f1" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "transaction" ("id" SERIAL NOT NULL, "transaction_external_id" character varying(36) NOT NULL, "account_external_id_debit" character varying(36), "account_external_id_credit" character varying(36), "transaction_type_id" integer NOT NULL, "transaction_status_id" integer NOT NULL, "transfer_type_id" integer NOT NULL, "value" numeric NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP, CONSTRAINT "UQ_bd9118a135878b66c8e2546ab04" UNIQUE ("transaction_external_id"), CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`ALTER TABLE "transaction" ADD CONSTRAINT "FK_98271e4a83052aeca9aa11fd3ca" FOREIGN KEY ("transaction_type_id") REFERENCES "transaction_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "transaction" ADD CONSTRAINT "FK_df972d66ba089168f1ffb0831ca" FOREIGN KEY ("transaction_status_id") REFERENCES "transaction_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "transaction" ADD CONSTRAINT "FK_065ab1a8dfaf0cf5e338a1fe89f" FOREIGN KEY ("transfer_type_id") REFERENCES "transfer_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_065ab1a8dfaf0cf5e338a1fe89f"`);
		await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_df972d66ba089168f1ffb0831ca"`);
		await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_98271e4a83052aeca9aa11fd3ca"`);
		await queryRunner.query(`DROP TABLE "transaction"`);
		await queryRunner.query(`DROP TABLE "transfer_type"`);
		await queryRunner.query(`DROP TABLE "transaction_type"`);
		await queryRunner.query(`DROP TABLE "transaction_status"`);
	}
}
