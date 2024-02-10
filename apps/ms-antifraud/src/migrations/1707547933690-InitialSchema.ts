import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class InitialSchema1707547933690 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(new Table({
        name: 'transactions',
        columns: [
          {
            name: 'transactionExternalId',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'accountExternalIdDebit',
            type: 'uuid',
          },
          {
            name: 'accountExternalIdCredit',
            type: 'uuid',
          },
          {
            name: 'transferTypeId',
            type: 'integer',
          },
          {
            name: 'value',
            type: 'float',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
          },
        ],
      }));

      await queryRunner.createTable(new Table({
        name: 'transaction_types',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
          },
        ],
      }));

      await queryRunner.createTable(new Table({
        name: 'transaction_statuses',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
          },
        ],
      }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('transactions');
      await queryRunner.dropTable('transaction_types');
      await queryRunner.dropTable('transaction_statuses');
    }

}
