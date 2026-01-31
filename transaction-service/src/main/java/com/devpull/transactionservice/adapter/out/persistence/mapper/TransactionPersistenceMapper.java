package com.devpull.transactionservice.adapter.out.persistence.mapper;

import com.devpull.transactionservice.adapter.out.persistence.entity.TransactionEntity;
import com.devpull.transactionservice.domain.model.Transaction;

import java.time.Instant;

public final class TransactionPersistenceMapper {

    private TransactionPersistenceMapper() {}

    public static TransactionEntity toNewEntity(Transaction domain) {
        return TransactionEntity.newTransaction(domain.getId(),
                                                domain.getStatus(),
                                                domain.getType(),
                                                domain.getAmount(),
                                                domain.getAccountId(),
                                                Instant.now());
    }

    public static TransactionEntity toExistingEntity(Transaction tx) {
        return new TransactionEntity(
                tx.getId(),
                tx.getStatus(),
                tx.getType(),
                tx.getAmount(),
                tx.getCreatedAt(),
                tx.getUpdatedAt(),
                tx.getAccountId(),
                false
        );
    }

    public static Transaction toDomain(TransactionEntity entity) {
        return Transaction.rehydrate(
                entity.getId(),
                entity.getStatus(),
                entity.getType(),
                entity.getAmount(),
                entity.getCreatedAt(),
                entity.getUpdatedAt(),
                entity.getAccountId()
        );
    }
}
