package com.retotecnico.transaction.domain.port.out;

import com.retotecnico.transaction.domain.model.Transaction;

import java.util.Optional;
import java.util.UUID;

/**
 * Output port - persistence abstraction (Write model).
 */
public interface TransactionRepository {

    Transaction save(Transaction transaction);

    Optional<Transaction> findById(UUID transactionExternalId);
}
