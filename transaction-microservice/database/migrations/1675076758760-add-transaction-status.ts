import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddTransactionStatus1675076758760 implements MigrationInterface{
    name?: string;
    transactionStatusTable = new Table({
        name: 'transaction_status',  
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