package com.yape.codechallenge.repository;

import com.yape.codechallenge.model.Transaction;

import java.util.UUID;

public interface TransactionRepository {
    Transaction save(Transaction transaction);

    Transaction findById(UUID id);
}
