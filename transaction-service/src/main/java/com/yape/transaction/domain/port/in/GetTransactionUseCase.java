package com.yape.transaction.domain.port.in;

import com.yape.transaction.domain.model.Transaction;
import java.util.Optional;
import java.util.UUID;

public interface GetTransactionUseCase {

    /**
     * Retrieves a transaction by its external ID.
     *
     * @param transactionExternalId the external ID of the transaction
     * @return an Optional containing the transaction if found
     */
    Optional<Transaction> getTransaction(UUID transactionExternalId);
}
