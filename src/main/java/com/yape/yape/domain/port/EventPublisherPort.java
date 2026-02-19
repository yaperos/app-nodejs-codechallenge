package com.yape.yape.domain.port;

public interface EventPublisherPort {
    void publishTransactionCreated(Object event);
    void publishTransactionApproved(Object event);
    void publishTransactionRejected(Object event);
}
