package com.yape.application.port.in;

import java.util.UUID;

import com.yape.domain.model.Transaction;

import reactor.core.publisher.Mono;

public interface GetTransactionUseCase {
    Mono<Transaction> getTransaction(UUID transactionExternalId);
}
