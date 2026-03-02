package com.yape.application.port.out;

import java.util.UUID;

import com.yape.domain.model.Transaction;

import reactor.core.publisher.Mono;

public interface TransactionRepositoryPort {
    Mono<Transaction> save(Transaction transaction);

    Mono<Transaction> findById(UUID id);
}
