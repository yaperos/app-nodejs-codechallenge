package com.msucre.transaction.domain.repository;

import com.msucre.transaction.domain.model.Transaction;
import com.msucre.transaction.domain.model.type.TransactionStatus;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface TransactionByAccountRepository {

  Mono<Void> save(Transaction transaction);

  Flux<Transaction> findTransactionsByAccount(UUID accountId);

  Mono<Void> updateStatus(Transaction transaction, TransactionStatus status);
}
