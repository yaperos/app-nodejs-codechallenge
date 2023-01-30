import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddTransactionType1675076797319 implements MigrationInterface{

    name = 'AddTransactionType1675076797319';
    transactionTypeTable =new Table({
        name: 'transactiontype',
        columns: [
            {
                name: 'id',
                type: 'int',
                isPrimary: true
            },
            {
                name: 'description',
                type: 'varchar'
            },
            {
                name: 'createdAt',
                type: 'date'
            },
            {
                name: 'updatedAt',
                type: 'date'
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