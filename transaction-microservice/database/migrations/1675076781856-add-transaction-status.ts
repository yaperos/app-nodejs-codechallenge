import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddTransactionStatus1675076781856 implements MigrationInterface{
    name?: string;
    transactionStatusTable = new Table({
        name: 'transactionstatus',  
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
        }]
    });
    transaction?: boolean;
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(this.transactionStatusTable, true);
    }
    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable(this.transactionStatusTable, true);
    }
    
}