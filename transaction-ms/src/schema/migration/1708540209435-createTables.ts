import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1708540209435 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
        `        
        CREATE TABLE transaction
        (
            "id" BIGSERIAL PRIMARY KEY,
            "code" UUID NOT NULL,
            "account_external_id_debit" UUID NOT NULL,
            "account_external_id_credit" UUID NOT NULL,
            "value" NUMERIC NOT NULL,
            "tranfer_type"  VARCHAR(50) NOT NULL,
            "type" VARCHAR(50) NOT NULL,
            "status" VARCHAR(50) NOT NULL,
            "created_at" TIMESTAMP NOT NULL,
            "updated_at" TIMESTAMP,
             CONSTRAINT "code_unique" UNIQUE (code)
        );

        ALTER TABLE transaction ADD CONSTRAINT status_check check(status in('PENDING', 'APPROVED', 'REJECTED'));
        ALTER TABLE transaction ADD CONSTRAINT transfer_type_check check(tranfer_type in('ONUS', 'INTERBANK'));
        ALTER TABLE transaction ADD CONSTRAINT type_check check(type in('DEPOSIT', 'WITHDRAW', 'TRANSFER'));
        `
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE transaction`);
    }
}

