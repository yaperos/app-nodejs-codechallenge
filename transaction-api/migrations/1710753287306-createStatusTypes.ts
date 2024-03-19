import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStatusTypes1710753287306 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `INSERT INTO transaction_status (name) VALUES ('pending'),
            ('approved'), ('rejected')`,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DELETE FROM transaction_status WHERE name in ('pending','approved','rejected')`,
        )
    }

}
