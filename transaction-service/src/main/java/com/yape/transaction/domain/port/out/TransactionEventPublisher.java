package com.yape.transaction.domain.port.out;

import com.yape.transaction.domain.model.Transaction;

public interface TransactionEventPublisher {

    /**
     * Publishes a transaction created event.
     *
     * @param transaction the created transaction
     */
    void publishTransactionCreated(Transaction transaction);
}
