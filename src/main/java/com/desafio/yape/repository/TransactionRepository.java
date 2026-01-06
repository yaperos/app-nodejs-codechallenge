package com.desafio.yape.repository;

import com.desafio.yape.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Optional<Transaction> findByTransactionExternalId(String transactionExternalId);
}
