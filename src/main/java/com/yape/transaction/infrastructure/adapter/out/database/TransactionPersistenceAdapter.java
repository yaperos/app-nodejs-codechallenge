package com.yape.transaction.infrastructure.adapter.out.database;

import com.yape.transaction.application.port.out.TransactionRepositoryPort;
import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.infrastructure.adapter.out.database.entity.TransactionEntity;
import com.yape.transaction.infrastructure.adapter.out.database.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class TransactionPersistenceAdapter implements TransactionRepositoryPort {

    private final TransactionRepository transactionRepository;

    @Override
    public Transaction save(Transaction transaction) {
        TransactionEntity entity = TransactionEntity.builder()
                .accountExternalIdDebit(transaction.getAccountExternalIdDebit())
                .accountExternalIdCredit(transaction.getAccountExternalIdCredit())
                .transferTypeId(transaction.getTransferTypeId())
                .value(transaction.getValue())
                .status(transaction.getStatus())
                .build();

        if (transaction.getTransactionExternalId() != null) {
            entity.setTransactionExternalId(transaction.getTransactionExternalId());
        }

        TransactionEntity savedEntity = transactionRepository.save(entity);
        return mapToDomain(savedEntity);
    }

    @Override
    public Optional<Transaction> findById(UUID id) {
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
