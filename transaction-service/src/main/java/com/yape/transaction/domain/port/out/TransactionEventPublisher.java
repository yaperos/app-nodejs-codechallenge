package com.yape.transaction.domain.port.out;

import com.yape.transaction.domain.event.TransactionCreatedEvent;

public interface TransactionEventPublisher {

    void publishTransactionCreated(TransactionCreatedEvent event);
}
