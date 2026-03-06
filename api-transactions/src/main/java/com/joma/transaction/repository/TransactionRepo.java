package com.joma.transaction.repository;

import com.joma.transaction.entity.Transaction;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface TransactionRepo extends ReactiveCrudRepository<Transaction, String> {

    Mono<Transaction> findBytransactionExternalId(String id);

}
