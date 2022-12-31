import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';
import { Transaction } from '../models';
import { StatusInterface } from '../../src/Interfaces/transaction.interface'

export default Factory.define(Transaction.tableName).attrs({
  transactionExternalId: faker.datatype.uuid(),
  accountExternalIdDebit: faker.datatype.uuid(),
  accountExternalIdCredit: faker.datatype.uuid(),
  tranferTypeId: faker.datatype.number({ min: 1, max: 2 }),
  value: faker.datatype.number({ min: 900, max: 1500 }),
  status: StatusInterface.PENDING
});
