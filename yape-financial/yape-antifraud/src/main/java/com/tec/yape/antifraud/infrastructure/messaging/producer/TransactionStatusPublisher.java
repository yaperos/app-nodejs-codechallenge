package com.tec.yape.antifraud.infrastructure.messaging.producer;

import com.tec.yape.antifraud.domain.model.TransactionValidatedEvent;

public interface TransactionStatusPublisher {

    void publish(TransactionValidatedEvent message);
}
