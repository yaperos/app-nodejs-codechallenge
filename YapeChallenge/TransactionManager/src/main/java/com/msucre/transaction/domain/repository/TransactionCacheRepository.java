package com.msucre.transaction.domain.repository;

import com.msucre.transaction.domain.model.Transaction;
import com.msucre.transaction.domain.model.type.TransactionStatus;
import reactor.core.publisher.Mono;

public interface TransactionCacheRepository {

  Mono<Void> save(Transaction transaction);

  Mono<Void> updateStatusById(String id, TransactionStatus status);

  Mono<Transaction> findById(String id);
}
