package com.yape.challenge.antifraud.domain.messaging;

import com.yape.challenge.antifraud.domain.model.TransactionStatus;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface EventPublisher {
    Mono<Void> publishTransactionStatusUpdate(UUID transactionId, TransactionStatus status);
}
