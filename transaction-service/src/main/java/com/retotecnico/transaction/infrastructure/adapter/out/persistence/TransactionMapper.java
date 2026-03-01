package com.retotecnico.transaction.infrastructure.adapter.out.persistence;

import com.retotecnico.transaction.domain.model.Transaction;
import com.retotecnico.transaction.domain.model.TransactionStatus;
import com.retotecnico.transaction.domain.model.TransferType;

/**
 * Mapper between domain model and JPA entity.
 */
public class TransactionMapper {

    private TransactionMapper() {
    }

    public static TransactionJpaEntity toJpaEntity(Transaction domain) {
        return TransactionJpaEntity.builder()
                .transactionExternalId(domain.getTransactionExternalId())
                .accountExternalIdDebit(domain.getAccountExternalIdDebit())
                .accountExternalIdCredit(domain.getAccountExternalIdCredit())
                .transferTypeId(domain.getTransferType().getId())
                .value(domain.getValue())
                .status(domain.getStatus().name())
                .createdAt(domain.getCreatedAt())
                .build();
    }

    public static Transaction toDomain(TransactionJpaEntity entity) {
        return Transaction.builder()
                .transactionExternalId(entity.getTransactionExternalId())
                .accountExternalIdDebit(entity.getAccountExternalIdDebit())
                .accountExternalIdCredit(entity.getAccountExternalIdCredit())
                .transferType(TransferType.fromId(entity.getTransferTypeId()))
                .value(entity.getValue())
                .status(TransactionStatus.valueOf(entity.getStatus()))
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
