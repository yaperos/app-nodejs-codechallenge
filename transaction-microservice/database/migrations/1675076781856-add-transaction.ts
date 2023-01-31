import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class AddTransaction1675076781856 implements MigrationInterface{
    name = 'AddTransaction1675076781856';
    transactionTable =new Table({
        name: 'transaction',
        columns: [
            {
                name: 'id',
                type: 'int',
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'identity'
            },
            {
                name: 'externalId',
                isUnique: true,
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
                name: 'typeId',
                type: 'int'
            },
            {
                name: 'value',
                type: 'decimal',
                isNullable: false
            },
            {
                name: 'statusId',
                type: 'int'
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

    statusForeignKey = new TableForeignKey({
        columnNames: ['statusId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'transaction_status',
        onDelete: 'RESTRICT'
    });

    typeForeignKey = new TableForeignKey({
        columnNames: ['typeId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'transaction_type',
        onDelete: 'RESTRICT'
    })

    transaction?: boolean;
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable( this.transactionTable, true);
        await queryRunner.createForeignKey(this.transactionTable, this.statusForeignKey);
        await queryRunner.createForeignKey(this.transactionTable, this.typeForeignKey);
    }
    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable( this.transactionTable, true);
    }
    
}