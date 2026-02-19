package com.yape.yape.infrastructure.adapter.out.jpa.mapper;

import com.yape.yape.domain.model.Transaction;
import com.yape.yape.domain.model.TransactionStatus;
import com.yape.yape.domain.model.TransactionType;
import com.yape.yape.infrastructure.adapter.out.jpa.entity.TransactionEntity;

public final class TransactionJpaMapper {

    private TransactionJpaMapper() {}

    public static Transaction toDomain(TransactionEntity e) {
        return new Transaction(
                e.getTransactionExternalId(),
                e.getAccountExternalIdDebit(),
                e.getAccountExternalIdCredit(),
                e.getTransferTypeId(),
                resolveType(e.getTransferTypeId()),
                TransactionStatus.valueOf(e.getStatus()),
                e.getValue(),
                e.getCreatedAt()
        );
    }

    public static TransactionEntity toEntity(Transaction t) {
        return TransactionEntity.builder()
                .transactionExternalId(t.getTransactionExternalId())
                .accountExternalIdDebit(t.getAccountExternalIdDebit())
                .accountExternalIdCredit(t.getAccountExternalIdCredit())
                .transferTypeId(t.getTransferTypeId())
                .value(t.getValue())
                .status(t.getStatus().name())
                .createdAt(t.getCreatedAt())
                .build();
    }

    private static TransactionType resolveType(Integer transferTypeId) {
        return TransactionType.TRANSFER;
    }
}
