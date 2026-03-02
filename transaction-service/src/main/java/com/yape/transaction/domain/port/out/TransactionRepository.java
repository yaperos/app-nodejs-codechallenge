package com.yape.transaction.domain.port.out;

import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.model.TransactionStatus;

import java.util.Optional;
import java.util.UUID;

public interface TransactionRepository {

    Transaction save(Transaction transaction);

    Optional<Transaction> findByExternalId(UUID externalId);

    Transaction updateStatus(UUID externalId, TransactionStatus status);
}
