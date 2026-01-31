package com.devpull.transactionservice.application.port.in;

import reactor.core.publisher.Mono;

import java.util.UUID;

public interface UpdateTransactionStatusUseCase {
    Mono<Void> updateStatus(UUID transactionId, String status);
}
