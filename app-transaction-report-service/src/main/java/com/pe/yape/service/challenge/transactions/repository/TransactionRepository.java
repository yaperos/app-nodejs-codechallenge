package com.pe.yape.service.challenge.transactions.repository;

import com.pe.yape.service.challenge.transactions.domain.model.Transaction;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TransactionRepository extends ReactiveCrudRepository<Transaction, UUID> {
}