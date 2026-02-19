package com.yape.yape.domain.port;

import com.yape.yape.domain.model.Transaction;

import java.util.Optional;
import java.util.UUID;

public interface TransactionRepositoryPort {
    Transaction save(Transaction transaction);
    Optional<Transaction> findByExternalId(UUID externalId);
    void deleteByExternalId(UUID externalId);
    boolean existsByExternalId(UUID externalId);
}
