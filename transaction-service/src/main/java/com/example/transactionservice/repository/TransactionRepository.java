package com.example.transactionservice.repository;

import com.example.transactionservice.domain.Transaction;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface TransactionRepository extends R2dbcRepository<Transaction, Long> {
    
    Mono<Transaction> findByTransactionId(String transactionId);
}
