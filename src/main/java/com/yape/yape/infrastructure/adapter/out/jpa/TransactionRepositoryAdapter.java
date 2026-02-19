package com.yape.yape.infrastructure.adapter.out.jpa;

import com.yape.yape.domain.model.Transaction;
import com.yape.yape.domain.port.TransactionRepositoryPort;
import com.yape.yape.infrastructure.adapter.out.jpa.entity.TransactionEntity;
import com.yape.yape.infrastructure.adapter.out.jpa.mapper.TransactionJpaMapper;
import com.yape.yape.infrastructure.adapter.out.jpa.repository.JpaTransactionRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Repository
public class TransactionRepositoryAdapter implements TransactionRepositoryPort {

    private final JpaTransactionRepository jpa;

    public TransactionRepositoryAdapter(JpaTransactionRepository jpa) {
        this.jpa = jpa;
    }

    @Override
    @Transactional
    public Transaction save(Transaction transaction) {

        UUID id = transaction.getTransactionExternalId();

        Optional<TransactionEntity> existingOpt = jpa.findById(id);

        TransactionEntity entityToSave;
        if (existingOpt.isPresent()) {
            TransactionEntity existing = existingOpt.get();

            existing.setAccountExternalIdDebit(transaction.getAccountExternalIdDebit());
            existing.setAccountExternalIdCredit(transaction.getAccountExternalIdCredit());
            existing.setTransferTypeId(transaction.getTransferTypeId());
            existing.setValue(transaction.getValue());
            existing.setStatus(transaction.getStatus().name()); // si tu entity guarda String

            entityToSave = existing;
        } else {
            entityToSave = TransactionJpaMapper.toEntity(transaction);
        }

        TransactionEntity saved = jpa.save(entityToSave);
        return TransactionJpaMapper.toDomain(saved);
    }

    @Override
    public Optional<Transaction> findByExternalId(UUID externalId) {
        return jpa.findById(externalId).map(TransactionJpaMapper::toDomain);
    }

    @Override
    public void deleteByExternalId(UUID externalId) {
        jpa.deleteById(externalId);
    }

    @Override
    public boolean existsByExternalId(UUID externalId) {
        return jpa.existsById(externalId);
    }
}
