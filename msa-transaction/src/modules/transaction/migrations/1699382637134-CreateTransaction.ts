import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTransaction1699382637134 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'transaction',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'accountExternalIdDebit',
            type: 'varchar',
          },
          {
            name: 'accountExternalIdCredit',
            type: 'varchar',
          },
          {
            name: 'tranferTypeId',
            type: 'integer',
          },
          {
            name: 'value',
            type: 'decimal',
          },
          {
            name: 'status',
            type: 'varchar',
            default: "'pending'",
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('transaction', true);
  }
}
