package com.yape.transaction.domain.port.out;

import com.yape.transaction.domain.model.Transaction;
import java.util.Optional;
import java.util.UUID;

public interface TransactionCachePort {

    /**
     * Caches a transaction.
     *
     * @param transaction the transaction to cache
     */
    void put(Transaction transaction);

    /**
     * Retrieves a cached transaction.
     *
     * @param transactionExternalId the external ID
     * @return an Optional containing the cached transaction if found
     */
    Optional<Transaction> get(UUID transactionExternalId);

    /**
     * Invalidates a cached transaction.
     *
     * @param transactionExternalId the external ID to invalidate
     */
    void invalidate(UUID transactionExternalId);
}
