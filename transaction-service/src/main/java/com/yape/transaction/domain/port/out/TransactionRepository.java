package com.yape.transaction.domain.port.out;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import com.yape.transaction.domain.model.Transaction;

public interface TransactionRepository {
    Transaction save(Transaction transaction);
    Optional<Transaction> findById(UUID id);
    List<Transaction> findAll();
}
