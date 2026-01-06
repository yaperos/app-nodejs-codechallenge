package com.yape.transaction.infrastructure.persistence.adapter;

import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.model.TransactionStatus;
import com.yape.transaction.domain.model.TransactionType;
import com.yape.transaction.domain.port.TransactionRepository;
import com.yape.transaction.infrastructure.persistence.entity.TransactionEntity;
import com.yape.transaction.infrastructure.persistence.repository.JpaTransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

/**
 * Adaptador de persistencia - Implementa el port TransactionRepository
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class TransactionPersistenceAdapter implements TransactionRepository {

    private final JpaTransactionRepository jpaRepository;

    @Override
    public Transaction save(Transaction transaction) {
        TransactionEntity entity = toEntity(transaction);
        TransactionEntity savedEntity = jpaRepository.save(entity);
        return toDomain(savedEntity);
    }

    @Override
    public Optional<Transaction> findByExternalId(UUID transactionExternalId) {
        return jpaRepository.findByTransactionExternalId(transactionExternalId)
                .map(this::toDomain);
    }

    @Override
    public Transaction update(Transaction transaction) {
        TransactionEntity entity = toEntity(transaction);
        TransactionEntity updatedEntity = jpaRepository.save(entity);
        return toDomain(updatedEntity);
    }

    private TransactionEntity toEntity(Transaction transaction) {
        return TransactionEntity.builder()
                .id(transaction.getId())
                .transactionExternalId(transaction.getTransactionExternalId())
                .accountExternalIdDebit(transaction.getAccountExternalIdDebit())
                .accountExternalIdCredit(transaction.getAccountExternalIdCredit())
                .transferTypeId((long) transaction.getTransactionType().getId())
                .transactionStatusId(mapStatusToId(transaction.getTransactionStatus()))
                .value(transaction.getValue())
                .version(transaction.getVersion())
                .createdAt(transaction.getCreatedAt())
                .updatedAt(transaction.getUpdatedAt())
                .build();
    }

    private Transaction toDomain(TransactionEntity entity) {
        return Transaction.builder()
                .id(entity.getId())
                .transactionExternalId(entity.getTransactionExternalId())
                .accountExternalIdDebit(entity.getAccountExternalIdDebit())
                .accountExternalIdCredit(entity.getAccountExternalIdCredit())
                .transactionType(TransactionType.fromId(entity.getTransferTypeId().intValue()))
                .transactionStatus(mapIdToStatus(entity.getTransactionStatusId()))
                .value(entity.getValue())
                .version(entity.getVersion())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    private Long mapStatusToId(TransactionStatus status) {
        return switch (status) {
            case PENDING -> 1L;
            case APPROVED -> 2L;
            case REJECTED -> 3L;
        };
    }

    private TransactionStatus mapIdToStatus(Long id) {
        return switch (id.intValue()) {
            case 1 -> TransactionStatus.PENDING;
            case 2 -> TransactionStatus.APPROVED;
            case 3 -> TransactionStatus.REJECTED;
            default -> throw new IllegalArgumentException("Invalid status id: " + id);
        };
    }
}

