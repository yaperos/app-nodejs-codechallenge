package com.yape.application.port.in;

import com.yape.domain.model.Transaction;

import reactor.core.publisher.Mono;

public interface CreateTransactionUseCase {
    Mono<Transaction> createTransaction(Transaction transaction);
}
