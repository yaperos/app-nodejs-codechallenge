package com.yape.antifraud.domain.port.out;

import com.yape.antifraud.domain.model.EvaluatedTransaction;

import java.util.Optional;
import java.util.UUID;

/**
 * Output port for persisting evaluated transactions.
 * This interface is defined in the domain layer and implemented by the infrastructure layer.
 */
public interface EvaluatedTransactionRepository {

    /**
     * Checks if a transaction has already been evaluated (idempotency check).
     *
     * @param transactionId the transaction identifier
     * @return true if the transaction has already been evaluated
     */
    boolean existsByTransactionId(UUID transactionId);

    /**
     * Persists an evaluated transaction.
     *
     * @param evaluatedTransaction the evaluated transaction to save
     */
    void save(EvaluatedTransaction evaluatedTransaction);

    /**
     * Finds an evaluated transaction by its transaction ID.
     *
     * @param transactionId the transaction identifier
     * @return the evaluated transaction if found
     */
    Optional<EvaluatedTransaction> findByTransactionId(UUID transactionId);
}
