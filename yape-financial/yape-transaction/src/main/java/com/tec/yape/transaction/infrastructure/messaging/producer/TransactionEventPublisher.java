package com.tec.yape.transaction.infrastructure.messaging.producer;

import com.tec.yape.transaction.domain.model.TransactionCreatedEvent;

public interface TransactionEventPublisher {

    void publish(TransactionCreatedEvent message);
}
