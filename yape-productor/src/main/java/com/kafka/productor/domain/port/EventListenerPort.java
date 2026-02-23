package com.kafka.productor.domain.port;

import com.kafka.productor.infrastructure.messaging.event.TransactionStatusUpdatedEvent;

public interface EventListenerPort {
    void publishTransactionStatusUpdated(TransactionStatusUpdatedEvent event);
}
