package com.yape.transactionservice.application.abstractions;

import com.yape.transactionservice.domain.models.Transaction;

public interface TransactionEventPublisher {
    void publishTransactionCreated(Transaction transaction);

}
