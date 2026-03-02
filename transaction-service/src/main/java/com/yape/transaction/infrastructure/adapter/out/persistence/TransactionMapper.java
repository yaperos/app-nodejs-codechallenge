package com.yape.transaction.infrastructure.adapter.out.persistence;

import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.model.TransactionStatus;
import jakarta.enterprise.context.ApplicationScoped;


@ApplicationScoped
public class TransactionMapper {

    public TransactionEntity toEntity(Transaction domain) {
        TransactionEntity entity = new TransactionEntity();
        entity.setTransactionExternalId(domain.getTransactionExternalId());
        entity.setAccountExternalIdDebit(domain.getAccountExternalIdDebit());
        entity.setAccountExternalIdCredit(domain.getAccountExternalIdCredit());
        entity.setTransferTypeId(domain.getTransferTypeId());
        entity.setValue(domain.getValue());
        entity.setStatus(domain.getStatus().getName());
        entity.setCreatedAt(domain.getCreatedAt());
        entity.setUpdatedAt(domain.getUpdatedAt());
        return entity;
    }

    public Transaction toDomain(TransactionEntity entity) {
        Transaction domain = new Transaction();
        domain.setTransactionExternalId(entity.getTransactionExternalId());
        domain.setAccountExternalIdDebit(entity.getAccountExternalIdDebit());
        domain.setAccountExternalIdCredit(entity.getAccountExternalIdCredit());
        domain.setTransferTypeId(entity.getTransferTypeId());
        domain.setValue(entity.getValue());
        domain.setStatus(TransactionStatus.fromString(entity.getStatus()));
        domain.setCreatedAt(entity.getCreatedAt());
        domain.setUpdatedAt(entity.getUpdatedAt());
        return domain;
    }

    public void updateEntity(TransactionEntity entity, Transaction domain) {
        entity.setStatus(domain.getStatus().getName());
        entity.setUpdatedAt(domain.getUpdatedAt());
    }
}
