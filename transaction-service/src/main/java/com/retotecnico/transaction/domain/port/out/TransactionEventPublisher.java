package com.retotecnico.transaction.domain.port.out;

import com.retotecnico.transaction.domain.model.Transaction;

/**
 * Output port - publishes transaction events to messaging system (Kafka).
 */
public interface TransactionEventPublisher {

    void publishTransactionCreated(Transaction transaction);
}
