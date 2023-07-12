import { Optional } from 'typescript-optional';
import { TransactionEntity } from '../adapters/repository/entity/transaction.entity';
import Transaction from '../../domain/transaction';

export default class TransactionMapper {
  public static toDomain(
    transactionEntity: TransactionEntity,
  ): Optional<Transaction> {
    if (!transactionEntity) {
      return Optional.empty<Transaction>();
    }
    const product = new Transaction({
      transactionId: transactionEntity.transactionId,
      accountExternalIdDebit: transactionEntity.accountExternalIdDebit,
      accountExternalIdCredit: transactionEntity.accountExternalIdCredit,
      tranferTypeId: transactionEntity.tranferTypeId,
      value: transactionEntity.value,
      status: transactionEntity.status,
      createdAt: transactionEntity.createdAt,
    });
    return Optional.of(product);
  }

  public static toDomains(
    transactionsEntity: TransactionEntity[],
  ): Transaction[] {
    const transactions = new Array<Transaction>();
    transactionsEntity.forEach((transactionEntity) => {
      const transaction = this.toDomain(transactionEntity);
      transactions.push(transaction.get());
    });
    return transactions;
  }
}
