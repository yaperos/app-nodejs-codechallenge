import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class TransactionCatalog1710440132576 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'transaction_catalog',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            generatedType: 'STORED',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '20',
            isUnique: true,
          },
          {
            name: 'type',
            type: 'enum',
            length: '30',
            enum: ['TRANSACTION_STATUS', 'TRANSACTION_TYPE'],
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'transaction_catalog',
      new TableIndex({
        name: 'TRANSACTION_CATALOG_ID',
        columnNames: ['id'],
      }),
    );

    await queryRunner.createIndex(
      'transaction_catalog',
      new TableIndex({
        name: 'TRANSACTION_TYPE',
        columnNames: ['type'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('transaction_catalog');
  }
}
