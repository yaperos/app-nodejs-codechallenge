import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddTransactionType1675076749078 implements MigrationInterface{

    name = 'AddTransactionType1675076749078';
    transactionTypeTable =new Table({
        name: 'transaction_type',
        columns: [
            {
                name: 'id',
                type: 'int',
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'identity'
            },
            {
                name: 'description',
                type: 'varchar'
            },
            {
                name: 'createdAt',
                type: 'timestamp'
            },
            {
                name: 'updatedAt',
                type: 'timestamp',
                isNullable: true
            }
        ]
    });

    transaction?: boolean;
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable( this.transactionTypeTable, true);
    }
    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable( this.transactionTypeTable, true);
    }
    
}