package com.retotecnico.transaction.domain.port.out;

import com.retotecnico.transaction.domain.model.Transaction;

import java.util.Optional;
import java.util.UUID;

/**
 * Output port - cache abstraction for CQRS read model (Redis).
 */
public interface TransactionCacheRepository {

    void save(Transaction transaction);

    Optional<Transaction> findById(UUID transactionExternalId);

    void deleteById(UUID transactionExternalId);
}
