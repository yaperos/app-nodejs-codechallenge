package com.challenge.transaction.core.ports.output;

import com.challenge.transaction.core.domain.model.Transaction;

public interface TransactionEventPublisher {
    void publishTransactionCreated(Transaction transaction);
}
