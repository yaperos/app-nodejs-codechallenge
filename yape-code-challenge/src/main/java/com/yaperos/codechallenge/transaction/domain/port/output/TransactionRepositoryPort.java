package com.yaperos.codechallenge.transaction.domain.port.output;

import com.yaperos.codechallenge.transaction.domain.model.Transaction;

import java.util.Optional;
import java.util.UUID;

public interface TransactionRepositoryPort {

    Transaction save(Transaction transaction);

    Optional<Transaction> findById(UUID transactionExternalId);

}
