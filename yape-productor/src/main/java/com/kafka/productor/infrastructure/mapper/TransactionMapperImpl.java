package com.kafka.productor.infrastructure.mapper;

import org.springframework.stereotype.Component;

import com.kafka.productor.domain.model.Transaction;
import com.kafka.productor.domain.model.TransactionStatus;
import com.kafka.productor.domain.model.TransactionType;
import com.kafka.productor.infrastructure.persistence.entity.TransactionEntity;

@Component
public class TransactionMapperImpl implements TransactionMapperInterface {

    @Override
    public TransactionEntity toEntity(Transaction transaction) {

        if (transaction == null) {
            return null;
        }

        TransactionEntity entity = new TransactionEntity();

        entity.setTransactionExternalId(transaction.getTransactionExternalId());
        entity.setAccountExternalIdDebit(transaction.getAccountExternalIdDebit());
        entity.setAccountExternalIdCredit(transaction.getAccountExternalIdCredit());
        entity.setTransactionTypeId(
                transaction.getTransactionType() != null
                        ? transaction.getTransactionType().getId()
                        : null
        );
        entity.setTransactionTypeName(
                transaction.getTransactionType() != null
                        ? transaction.getTransactionType().getName()
                        : null
        );
        entity.setStatus(
                transaction.getStatus() != null
                        ? transaction.getStatus().name()
                        : null
        );
        entity.setValue(transaction.getValue());
        entity.setCreatedAt(transaction.getCreatedAt());

        return entity;
    }

    @Override
    public Transaction toDomain(TransactionEntity entity) {

        if (entity == null) {
            return null;
        }

        TransactionType transactionType = new TransactionType(
                entity.getTransactionTypeId(),
                entity.getTransactionTypeName()
        );

        Transaction transaction = new Transaction(
                entity.getTransactionExternalId(),
                entity.getAccountExternalIdDebit(),
                entity.getAccountExternalIdCredit(),
                transactionType,
                entity.getValue()
        );

        if (entity.getStatus() != null) {
            transaction.setStatus(TransactionStatus.valueOf(entity.getStatus()));
        }

        return transaction;
    }
}