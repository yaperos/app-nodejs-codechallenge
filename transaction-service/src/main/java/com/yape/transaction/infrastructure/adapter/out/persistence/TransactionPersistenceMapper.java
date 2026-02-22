package com.yape.transaction.infrastructure.adapter.out.persistence;

import com.yape.transaction.domain.model.Transaction;

final class TransactionPersistenceMapper {

    private TransactionPersistenceMapper() {}

    static TransactionJpaEntity toJpaEntity(Transaction domain) {
        var entity = new TransactionJpaEntity();
        entity.setId(domain.getId());
        entity.setAccountExternalIdDebit(domain.getAccountExternalIdDebit());
        entity.setAccountExternalIdCredit(domain.getAccountExternalIdCredit());
        entity.setTransferTypeId(domain.getTransferTypeId());
        entity.setValue(domain.getValue());
        entity.setStatus(domain.getStatus());
        entity.setCreatedAt(domain.getCreatedAt());
        entity.setUpdatedAt(domain.getUpdatedAt());
        return entity;
    }

    static Transaction toDomain(TransactionJpaEntity entity) {
        return Transaction.reconstitute(
                entity.getId(),
                entity.getAccountExternalIdDebit(),
                entity.getAccountExternalIdCredit(),
                entity.getTransferTypeId(),
                entity.getValue(),
                entity.getStatus(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }
}
