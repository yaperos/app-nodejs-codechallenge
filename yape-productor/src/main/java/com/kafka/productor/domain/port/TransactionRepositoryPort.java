package com.kafka.productor.domain.port;

import java.util.Optional;
import java.util.UUID;

import com.kafka.productor.domain.model.Transaction;

public interface TransactionRepositoryPort {
    Transaction save(Transaction transaction);
    
    Optional<Transaction> findByTransactionExternalId(UUID transactionExternalId);

    void updateStatus(UUID transactionExternalId, String status);
}
