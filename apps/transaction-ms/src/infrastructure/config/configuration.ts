import { toArray } from '@app/common/utils.ts/to-array.util';
import { TransactionType } from '../../domain/model/transaction.model';

export default () => ({
  database: {
    uri: process.env.MONGODB_URI,
  },
  transactionTypes: toArray<TransactionType>(process.env.TRANSACTION_TYPES),
  kafka: {
    uri: process.env.KAFKA_URI,
    consumerName: process.env.KAFKA_TRANSACTION_CONSUMER,
  },
});
