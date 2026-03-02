package com.yape.transaction_service.service;

import com.yape.transaction_service.model.Transaction;

import java.util.Optional;
import java.util.UUID;

public interface TransactionService {
    Transaction save(Transaction transaction);

    Optional<Transaction> findById(UUID id);
}
