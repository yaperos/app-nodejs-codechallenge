package com.devpull.transactionservice.application.port.out;

import com.devpull.transactionservice.domain.model.Transaction;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface TransactionRepositoryPort {

    Mono<Transaction> save(Transaction tx);

    Mono<Transaction> update(Transaction tx);

    Mono<Transaction> findById(UUID id);

}
