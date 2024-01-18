import { Transaction } from '../../domain/transaction';
import { Status } from '../../domain/constants.enum';

export class TransactionGetDto {
  static domainToGetResponse(transaction: Transaction) {
    return {
      transactionExternalId: transaction.data().transactionExternalId,
      transactionType: { name: transaction.data().transferTypeId,},
      transactionStatus: { name: Status[transaction.data().status]},
      value: transaction.data().value,
      createdAt: transaction.data().createdAt,
    };
  }
}
