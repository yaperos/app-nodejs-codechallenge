import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class InitialMigration1675076749078 implements MigrationInterface{

    name = 'InitialMigration1675076749078';
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
                type: 'timestamp',
                default: 'LOCALTIMESTAMP'
            },
            {
                name: 'updatedAt',
                type: 'timestamp',
                isNullable: true
            }
        ]
    });

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
            type: 'timestamp',
            default: 'LOCALTIMESTAMP'
        },
        {
            name: 'updatedAt',
            type: 'timestamp',
            isNullable: true
        }]
    });

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
        await queryRunner.createTable( this.transactionTypeTable, true);
        await queryRunner.createTable(this.transactionStatusTable, true);
        await queryRunner.createTable( this.transactionTable, true);
        await queryRunner.createForeignKey(this.transactionTable, this.statusForeignKey);
        await queryRunner.createForeignKey(this.transactionTable, this.typeForeignKey);
    }
    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable( this.transactionTypeTable, true);
        await queryRunner.dropTable( this.transactionStatusTable, true);
        await queryRunner.dropTable( this.transactionTable, true);
    }
    
}