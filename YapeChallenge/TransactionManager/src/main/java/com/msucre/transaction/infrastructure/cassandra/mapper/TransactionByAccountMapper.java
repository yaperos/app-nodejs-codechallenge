package com.msucre.transaction.infrastructure.cassandra.mapper;

import com.msucre.transaction.domain.model.Transaction;
import com.msucre.transaction.infrastructure.cassandra.entity.TransactionByAccountEntity;

public class TransactionByAccountMapper {

  public static TransactionByAccountEntity toEntity(final Transaction transaction) {
    TransactionByAccountEntity transactionByAccountEntity = new TransactionByAccountEntity();
    transactionByAccountEntity.transactionId = transaction.id;
    transactionByAccountEntity.sourceAccountId = transaction.sourceAccountId;
    transactionByAccountEntity.destinationAccountId = transaction.destinationAccountId;
    transactionByAccountEntity.createdAt = transaction.createdAt;
    transactionByAccountEntity.status = transaction.status;
    transactionByAccountEntity.amount = transaction.amount;
    transactionByAccountEntity.type = transaction.type;
    return transactionByAccountEntity;
  }

  public static Transaction toTransaction(final TransactionByAccountEntity transactionByAccountEntity) {
    Transaction transaction = new Transaction();
    transaction.id = transactionByAccountEntity.transactionId;
    transaction.sourceAccountId = transactionByAccountEntity.sourceAccountId;
    transaction.destinationAccountId = transactionByAccountEntity.destinationAccountId;
    transaction.createdAt = transactionByAccountEntity.createdAt;
    transaction.status = transactionByAccountEntity.status;
    transaction.amount = transactionByAccountEntity.amount;
    transaction.type = transactionByAccountEntity.type;
    return transaction;
  }
}
