import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateTransactionTable1704601341999 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'transactions',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'account_external_id_debit',
                    type: 'varchar',
                    isNullable: false
                },
                {
                    name: 'account_external_id_credit',
                    type: 'varchar',
                    isNullable: false
                },
                {
                    name: 'transfer_type_id',
                    type: 'integer',
                    isNullable: false
                },
                {
                    name: 'value',
                    type: 'decimal',
                    isNullable: false
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                }
            ],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('transactions');
    }

}
