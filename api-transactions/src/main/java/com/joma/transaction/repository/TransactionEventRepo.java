package com.joma.transaction.repository;

import com.joma.transaction.entity.Transaction;
import com.joma.transaction.entity.TransactionEventSource;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionEventRepo extends ReactiveCrudRepository<TransactionEventSource, String> {
}
