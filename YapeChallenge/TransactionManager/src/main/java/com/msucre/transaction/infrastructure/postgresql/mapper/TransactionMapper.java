package com.msucre.transaction.infrastructure.postgresql.mapper;

import com.msucre.transaction.domain.model.Transaction;
import com.msucre.transaction.infrastructure.postgresql.entity.TransactionEntity;

public class TransactionMapper {

  public static TransactionEntity toEntity(Transaction transaction) {
    TransactionEntity transactionEntity = new TransactionEntity();
    transactionEntity.id = transaction.id;
    transactionEntity.sourceAccountId = transaction.sourceAccountId;
    transactionEntity.destinationAccountId = transaction.destinationAccountId;
    transactionEntity.createdAt = transaction.createdAt;
    transactionEntity.status = transaction.status;
    transactionEntity.type = transaction.type;
    transactionEntity.amount = transaction.amount;
    return transactionEntity;
  }

  public static Transaction toTransaction(TransactionEntity transactionEntity) {
    Transaction transaction = new Transaction();
    transaction.id = transactionEntity.id;
    transaction.sourceAccountId = transactionEntity.sourceAccountId;
    transaction.destinationAccountId = transactionEntity.destinationAccountId;
    transaction.createdAt = transactionEntity.createdAt;
    transaction.status = transactionEntity.status;
    transaction.type = transactionEntity.type;
    transaction.amount = transactionEntity.amount;
    return transaction;
  }
}
