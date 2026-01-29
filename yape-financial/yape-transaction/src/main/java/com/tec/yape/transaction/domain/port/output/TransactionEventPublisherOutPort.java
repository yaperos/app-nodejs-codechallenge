package com.tec.yape.transaction.domain.port.output;

import com.tec.yape.transaction.domain.model.TransactionCreatedEvent;

public interface TransactionEventPublisherOutPort {

    void publish(TransactionCreatedEvent transaction);
}
