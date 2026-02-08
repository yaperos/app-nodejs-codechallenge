package com.yaperos.codechallenge.transaction.infrastructure.adapter.output.persistence.mapper;

import com.yaperos.codechallenge.transaction.domain.model.Transaction;
import com.yaperos.codechallenge.transaction.infrastructure.adapter.output.persistence.entity.TransactionJpaEntity;
import org.springframework.stereotype.Component;

@Component
public class TransactionPersistenceMapper {

    public TransactionJpaEntity toJpaEntity(Transaction domain) {
        TransactionJpaEntity entity = new TransactionJpaEntity();
        entity.setTransactionExternalId(domain.getTransactionExternalId());
        entity.setAccountExternalIdDebit(domain.getAccountExternalIdDebit());
        entity.setAccountExternalIdCredit(domain.getAccountExternalIdCredit());
        entity.setTransferType(domain.getTransferType());
        entity.setValue(domain.getValue());
        entity.setStatus(domain.getStatus());
        entity.setCreatedAt(domain.getCreatedAt());
        return entity;
    }

    public Transaction toDomain(TransactionJpaEntity entity) {
        return new Transaction(
                entity.getTransactionExternalId(),
                entity.getAccountExternalIdDebit(),
                entity.getAccountExternalIdCredit(),
                entity.getTransferType(),
                entity.getValue(),
                entity.getStatus(),
                entity.getCreatedAt()
        );
    }

}
