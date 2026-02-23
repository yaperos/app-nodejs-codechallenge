package com.kafka.productor.domain.port;

import com.kafka.productor.domain.model.Transaction;

public interface EventPublisherPort {
    void publishTransactionCreated(Transaction transaction);
}
