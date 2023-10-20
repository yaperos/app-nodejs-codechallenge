import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TransactionMigration1697597319014 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'transaction',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'transaction_external_id',
            type: 'varchar'
          },
          {
            name: 'account_external_id_debit',
            type: 'varchar'
          },
          {
            name: 'account_external_id_credit',
            type: 'varchar'
          },
          {
            name: 'tranfer_type_id',
            type: 'int'
          },
          {
            name: 'value',
            type: 'float'
          },
          {
            name: 'status',
            type: 'varchar'
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()'
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: true
          }
        ]
      }),
      true
    );

  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const removeTables = ['transaction'];

    removeTables.map(async (tableName) => {
      await queryRunner.query(`DROP TABLE "${tableName}" CASCADE`);
    });
  }
}