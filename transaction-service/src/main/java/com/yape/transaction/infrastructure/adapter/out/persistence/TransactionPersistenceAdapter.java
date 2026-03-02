package com.yape.transaction.infrastructure.adapter.out.persistence;

import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.model.TransactionStatus;
import com.yape.transaction.domain.model.TransactionType;
import com.yape.transaction.domain.port.out.TransactionRepository;
import com.yape.transaction.infrastructure.adapter.out.persistence.entity.TransactionEntity;
import com.yape.transaction.infrastructure.adapter.out.persistence.repository.TransactionJpaRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
public class TransactionPersistenceAdapter implements TransactionRepository {

    private final TransactionJpaRepository jpaRepository;

    public TransactionPersistenceAdapter(TransactionJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Transaction save(Transaction transaction) {
        TransactionEntity entity = toEntity(transaction);
        TransactionEntity saved = jpaRepository.save(entity);
        return toDomain(saved);
    }

    @Override
    public Optional<Transaction> findByTransactionExternalId(UUID transactionExternalId) {
        return jpaRepository.findByTransactionExternalId(transactionExternalId)
                .map(this::toDomain);
    }

    @Override
    public Transaction update(Transaction transaction) {
        TransactionEntity entity = jpaRepository.findByTransactionExternalId(transaction.getTransactionExternalId())
                .orElseThrow();
        entity.setTransactionStatus(transaction.getTransactionStatus().name());
        return toDomain(jpaRepository.save(entity));
    }

    private TransactionEntity toEntity(Transaction domain) {
        TransactionEntity entity = new TransactionEntity();
        entity.setTransactionExternalId(domain.getTransactionExternalId());
        entity.setAccountExternalIdDebit(domain.getAccountExternalIdDebit());
        entity.setAccountExternalIdCredit(domain.getAccountExternalIdCredit());
        entity.setTransactionType(domain.getTransactionType().getName());
        entity.setTransactionTypeId(domain.getTransactionType().getId());
        entity.setTransactionStatus(domain.getTransactionStatus().name());
        entity.setValue(domain.getValue());
        entity.setCreatedAt(domain.getCreatedAt());
        return entity;
    }

    private Transaction toDomain(TransactionEntity entity) {
        Transaction transaction = Transaction.create(
                entity.getAccountExternalIdDebit(),
                entity.getAccountExternalIdCredit(),
                entity.getTransactionTypeId(),
                entity.getValue()
        );
        // Reconstruct status from DB
        applyStatus(transaction, entity.getTransactionStatus());
        return transaction;
    }

    private void applyStatus(Transaction transaction, String status) {
        if (TransactionStatus.APPROVED.name().equals(status)) transaction.approve();
        else if (TransactionStatus.REJECTED.name().equals(status)) transaction.reject();
        // PENDING is default, no action needed
    }
}
