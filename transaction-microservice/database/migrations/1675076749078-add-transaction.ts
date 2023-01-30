import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddTransaction1675076749078 implements MigrationInterface{
    name = 'AddTransaction1675076749078';
    transactionTable =new Table({
        name: 'transaction',
        columns: [
            {
                name: 'id',
                type: 'int',
                isPrimary: true
            },
            {
                name: 'externalId',
                type: 'varchar'
            },
            {
                name: 'accountExternalIdDebit',
                type: 'varchar'
            },
            {
                name: 'accountExternalIdCredit',
                type: 'varchar'
            },
            {
                name: 'transferTypeId',
                type: 'int'
            },
            {
                name: 'value',
                type: 'decimal'
            },
            {
                name: 'statusId',
                type: 'int'
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
        await queryRunner.createTable( this.transactionTable, true);
    }
    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable( this.transactionTable, true);
    }
    
}