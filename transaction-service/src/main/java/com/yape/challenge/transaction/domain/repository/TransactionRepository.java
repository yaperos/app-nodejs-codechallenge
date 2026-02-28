package com.yape.challenge.transaction.domain.repository;

import com.yape.challenge.transaction.domain.model.Transaction;
import com.yape.challenge.transaction.domain.model.TransactionStatus;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface TransactionRepository {
    Mono<Transaction> save(Transaction transaction);

    Mono<Transaction> findById(UUID id);

    Mono<Transaction> updateStatus(UUID id, TransactionStatus status);
}
