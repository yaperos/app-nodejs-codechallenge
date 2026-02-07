package com.yape.codechallenge.repository;

import com.yape.codechallenge.model.Transaction;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.UUID;

@ApplicationScoped
public class TransactionRepositoryImpl implements TransactionRepository {

    @Override
    public Transaction save(Transaction transaction) {
        transaction.persist();
        return transaction;
    }

    @Override
    public Transaction findById(UUID id) {
        return Transaction.findById(id);
    }
}
