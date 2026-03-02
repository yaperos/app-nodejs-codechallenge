package com.yape.transaction.domain.port.out;

import com.yape.transaction.domain.model.Transaction;

import java.util.Optional;
import java.util.UUID;

public interface TransactionRepository {

    Transaction save(Transaction transaction);

    Optional<Transaction> findByTransactionExternalId(UUID transactionExternalId);

    Transaction update(Transaction transaction);
}
