package com.yape.transaction.domain.port.out;

import com.yape.transaction.domain.model.Transaction;
import java.util.Optional;
import java.util.UUID;

public interface TransactionRepositoryPort {

    /**
     * Saves a transaction to the repository.
     *
     * @param transaction the transaction to save
     * @return the saved transaction
     */
    Transaction save(Transaction transaction);

    /**
     * Finds a transaction by its external ID.
     *
     * @param transactionExternalId the external ID
     * @return an Optional containing the transaction if found
     */
    Optional<Transaction> findByExternalId(UUID transactionExternalId);

    /**
     * Updates an existing transaction.
     *
     * @param transaction the transaction to update
     * @return the updated transaction
     */
    Transaction update(Transaction transaction);
}
