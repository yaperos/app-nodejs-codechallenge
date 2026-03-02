package com.yape.transaction.infrastructure.persistence.adapter;

import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.model.TransactionStatus;
import com.yape.transaction.domain.port.out.TransactionRepository;
import com.yape.transaction.infrastructure.persistence.entity.TransactionEntity;
import com.yape.transaction.infrastructure.persistence.repository.JpaTransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class TransactionRepositoryAdapter implements TransactionRepository {

    private final JpaTransactionRepository jpaTransactionRepository;

    @Override
    @Transactional
    public Transaction save(Transaction transaction) {
        TransactionEntity entity = toEntity(transaction);
        TransactionEntity savedEntity = jpaTransactionRepository.save(entity);
        log.debug("Transaction entity saved with id: {}", savedEntity.getId());
        return toDomain(savedEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Transaction> findByExternalId(UUID externalId) {
        return jpaTransactionRepository.findByExternalId(externalId)
                .map(this::toDomain);
    }

    @Override
    @Transactional
    public Transaction updateStatus(UUID externalId, TransactionStatus status) {
        int updated = jpaTransactionRepository.updateStatusByExternalId(externalId, status);
        if (updated == 0) {
            throw new RuntimeException("Transaction not found with externalId: " + externalId);
        }

        return jpaTransactionRepository.findByExternalId(externalId)
                .map(this::toDomain)
                .orElseThrow(() -> new RuntimeException("Transaction not found after update with externalId: " + externalId));
    }

    private TransactionEntity toEntity(Transaction transaction) {
        return TransactionEntity.builder()
                .id(transaction.getId())
                .externalId(transaction.getExternalId())
                .accountDebit(transaction.getAccountDebit())
                .accountCredit(transaction.getAccountCredit())
                .transferTypeId(transaction.getTransferTypeId())
                .value(transaction.getValue())
                .status(transaction.getStatus())
                .createdAt(transaction.getCreatedAt())
                .updatedAt(transaction.getUpdatedAt())
                .build();
    }

    private Transaction toDomain(TransactionEntity entity) {
        return Transaction.builder()
                .id(entity.getId())
                .externalId(entity.getExternalId())
                .accountDebit(entity.getAccountDebit())
                .accountCredit(entity.getAccountCredit())
                .transferTypeId(entity.getTransferTypeId())
                .value(entity.getValue())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
