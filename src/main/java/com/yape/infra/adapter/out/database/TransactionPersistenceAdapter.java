package com.yape.infra.adapter.out.database;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.yape.application.port.out.TransactionRepositoryPort;
import com.yape.domain.model.Transaction;
import com.yape.infra.adapter.out.database.entity.TransactionEntity;
import com.yape.infra.adapter.out.database.repository.TransactionRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Component
@Slf4j
@RequiredArgsConstructor
public class TransactionPersistenceAdapter implements TransactionRepositoryPort {

    private final TransactionRepository transactionRepository;

    @Override
    public Mono<Transaction> save(Transaction transaction) {
        TransactionEntity entity = TransactionEntity.builder()
                .accountExternalIdDebit(transaction.getAccountExternalIdDebit())
                .accountExternalIdCredit(transaction.getAccountExternalIdCredit())
                .transferTypeId(transaction.getTransferTypeId())
                .value(transaction.getValue())
                .status(transaction.getStatus())
                .createdAt(LocalDateTime.now())
                .build();

        if (transaction.getTransactionExternalId() != null) {
            entity.markNotNew();
            entity.setTransactionExternalId(transaction.getTransactionExternalId());
        } else {
            entity.setTransactionExternalId(UUID.randomUUID());
        }

        return transactionRepository.save(entity)
                .map(savedEntity -> {
                    log.info("Transaction saved with ID: {}", savedEntity.getTransactionExternalId());
                    return mapToDomain(savedEntity);
                });
    }

    @Override
    public Mono<Transaction> findById(UUID id) {
        return transactionRepository.findById(id)
                .map(this::mapToDomain);
    }

    private Transaction mapToDomain(TransactionEntity entity) {
        return Transaction.builder()
                .transactionExternalId(entity.getTransactionExternalId())
                .accountExternalIdDebit(entity.getAccountExternalIdDebit())
                .accountExternalIdCredit(entity.getAccountExternalIdCredit())
                .transferTypeId(entity.getTransferTypeId())
                .value(entity.getValue())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
