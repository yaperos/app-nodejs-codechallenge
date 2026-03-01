package com.yape.transactionservice.domain.repostories;

import com.yape.transactionservice.domain.models.Transaction;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TransactionRepository {
    Optional<Transaction> getById(UUID id);

    Transaction save(Transaction transaction);

    List<Transaction> getAll();
}
