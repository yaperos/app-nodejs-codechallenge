import { Knex } from 'knex';
import { Transaction } from '../../src/models';
import { StatusInterface } from '../../src/Interfaces/transaction.interface'

export const up = (knex: Knex): Promise<void> =>
  knex.schema.createTable(Transaction.tableName, (table: Knex.TableBuilder) => {
    table.increments();
    table.timestamps();
    table.string('transactionExternalId');
    table.string('accountExternalIdDebit');
    table.string('accountExternalIdCredit');
    table.integer('tranferTypeId');
    table.decimal('value');
    table.string('status').defaultTo(StatusInterface.PENDING);
  });

export const down = (knex: Knex): Promise<void> =>
  knex.schema.dropTable(Transaction.tableName);
