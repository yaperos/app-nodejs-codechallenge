package com.yape.transaction.domain.ports;

import reactor.core.publisher.Mono;
import com.yape.transaction.domain.entities.Transaction;

public interface TransactionRepositoryPort {
    Mono<Transaction> findById(String id);
    Mono<Transaction> save(Transaction transaction);
    Mono<Void> updateStatus(String transactionExternalId, String status);
}
