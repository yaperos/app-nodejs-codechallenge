package com.yape.transaction.domain.port.out;

import com.yape.transaction.domain.model.Transaction;

public interface TransactionEventPublisher {

    void publishTransactionCreated(Transaction transaction);
}
