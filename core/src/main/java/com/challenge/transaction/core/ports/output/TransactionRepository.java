package com.challenge.transaction.core.ports.output;

import com.challenge.transaction.core.domain.model.Transaction;

import java.util.Optional;
import java.util.UUID;

public interface TransactionRepository {
    Transaction save(Transaction transaction);

    Optional<Transaction> findByExternalId(UUID transactionExternalId);

    void updateStatus(UUID transactionExternalId, String status);
}
