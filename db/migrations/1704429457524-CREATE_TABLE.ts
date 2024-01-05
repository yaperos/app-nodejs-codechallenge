import { MigrationInterface, QueryRunner } from "typeorm";

export class CREATETABLE1704429457524 implements MigrationInterface {
    name = 'CREATETABLE1704429457524'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`log_validate_transaction\` (\`id\` int NOT NULL AUTO_INCREMENT, \`transactionExternalId\` varchar(255) NOT NULL, \`maximumValue\` int NOT NULL, \`value\` int NOT NULL, \`status\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`log_validate_transaction\``);
    }

}
