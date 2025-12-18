package com.yape.transactions.service;

import com.yape.transactions.entity.TransactionEntity;

import java.util.UUID;

public interface TransactionPersistence {

    TransactionEntity saveTransaction(TransactionEntity transactionEntity);

    TransactionEntity findByTransactionExternalId(UUID transactionExternalId);

    TransactionEntity updateTransactionStatus(TransactionEntity transactionEntity, String status);
}
