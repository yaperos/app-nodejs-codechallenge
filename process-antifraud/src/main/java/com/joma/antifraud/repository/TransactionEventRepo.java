package com.joma.antifraud.repository;

import com.joma.antifraud.entity.TransactionEventSource;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionEventRepo extends ReactiveCrudRepository<TransactionEventSource, String> {
}
