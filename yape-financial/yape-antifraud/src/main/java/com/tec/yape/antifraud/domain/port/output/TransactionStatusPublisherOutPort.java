package com.tec.yape.antifraud.domain.port.output;

import com.tec.yape.antifraud.domain.model.TransactionValidatedEvent;

public interface TransactionStatusPublisherOutPort {

    void publish(TransactionValidatedEvent event);
}
