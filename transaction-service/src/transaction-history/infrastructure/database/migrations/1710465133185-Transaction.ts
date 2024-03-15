import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class Transaction1710465133185 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'transactions',
        columns: [
          {
            name: 'transaction_external_id',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'account_external_id_debit',
            type: 'varchar',
            length: '150',
          },
          {
            name: 'account_external_id_credit',
            type: 'varchar',
            length: '150',
          },
          {
            name: 'transaction_type',
            type: 'int8',
          },
          {
            name: 'transaction_status',
            type: 'int8',
          },
          {
            name: 'value',
            type: 'decimal',
            default: 0,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'transactions',
      new TableForeignKey({
        columnNames: ['transaction_type'],
        referencedColumnNames: ['id'],
        referencedTableName: 'transaction_catalog',
      }),
    );

    await queryRunner.createForeignKey(
      'transactions',
      new TableForeignKey({
        columnNames: ['transaction_status'],
        referencedColumnNames: ['id'],
        referencedTableName: 'transaction_catalog',
      }),
    );

    await queryRunner.createIndex(
      'transactions',
      new TableIndex({
        name: 'TRANSACTIONS_ID',
        columnNames: ['transaction_external_id'],
      }),
    );

    await queryRunner.createIndex(
      'transactions',
      new TableIndex({
        name: 'TRANSACTIONS_TYPE',
        columnNames: ['transaction_type'],
      }),
    );

    await queryRunner.createIndex(
      'transactions',
      new TableIndex({
        name: 'TRANSACTIONS_STATUS',
        columnNames: ['transaction_status'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('transactions');
  }
}
