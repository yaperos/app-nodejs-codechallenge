package com.jotace.transaction.application.port.out;

import com.jotace.transaction.domain.model.Transaction;

import java.util.Optional;
import java.util.UUID;

public interface TransactionRepositoryPort {

    Transaction save(Transaction transaction);

    Optional<Transaction> findByExternalId(UUID transactionExternalId);

    void updateStatus(UUID transactionExternalId, String newStatus);

}
