package com.yape.challenge.transaction.domain.messaging;

import com.yape.challenge.transaction.domain.model.Transaction;
import reactor.core.publisher.Mono;

public interface EventPublisher {
    Mono<Void> publishTransactionCreatedEvent(Transaction transaction);
}
