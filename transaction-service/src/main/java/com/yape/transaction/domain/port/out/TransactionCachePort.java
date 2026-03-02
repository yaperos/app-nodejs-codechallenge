package com.yape.transaction.domain.port.out;

import com.yape.transaction.domain.model.Transaction;

import java.util.Optional;
import java.util.UUID;

public interface TransactionCachePort {

    Optional<Transaction> get(UUID externalId);

    void put(Transaction transaction);

    void evict(UUID externalId);
}
