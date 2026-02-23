package com.kafka.productor.domain.port;

import java.util.Optional;
import java.util.UUID;

import com.kafka.productor.domain.model.Transaction;

public interface TransactionCachePort {
    Optional<Transaction> findById(UUID transactionExternalId);

    void save(Transaction transaction);

    void delete(UUID transactionExternalId);
}
