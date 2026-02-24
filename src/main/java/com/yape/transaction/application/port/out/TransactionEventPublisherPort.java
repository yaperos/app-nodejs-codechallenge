package com.yape.transaction.application.port.out;

import com.yape.transaction.domain.model.Transaction;

public interface TransactionEventPublisherPort {
    void publishTransactionCreated(Transaction transaction);
}
