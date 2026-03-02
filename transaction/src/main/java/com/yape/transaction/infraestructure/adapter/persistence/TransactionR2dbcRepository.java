package com.yape.transaction.infraestructure.adapter.persistence;

import com.yape.transaction.domain.entities.Transaction;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;

public interface TransactionR2dbcRepository extends ReactiveCrudRepository<Transaction, Long> {
    Mono<Transaction> findByTransactionExternalId(String transactionExternalId);
}
