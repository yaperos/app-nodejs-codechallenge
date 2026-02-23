package com.kafka.productor.infrastructure.persistence.adapter;

import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.kafka.productor.domain.model.Transaction;
import com.kafka.productor.domain.port.TransactionRepositoryPort;
import com.kafka.productor.infrastructure.mapper.TransactionMapperInterface;
import com.kafka.productor.infrastructure.persistence.entity.TransactionEntity;
import com.kafka.productor.infrastructure.persistence.repository.JpaTransactionRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class TransactionRepositoryAdapter implements TransactionRepositoryPort {

    private final JpaTransactionRepository repository;
    private final TransactionMapperInterface mapper;

    @Override
    public Transaction save(Transaction transaction) {
        TransactionEntity entity = mapper.toEntity(transaction);
        repository.save(entity);
        return transaction;
    }

    @Override
    public Optional<Transaction> findByTransactionExternalId(UUID transactionExternalId) {
        return repository.findByTransactionExternalId(transactionExternalId)
                .map(mapper::toDomain);
    }

    @Override
    public void updateStatus(UUID transactionExternalId, String status) {
        TransactionEntity entity = repository.findByTransactionExternalId(transactionExternalId)
                .orElseThrow();

        entity.setStatus(status);
        repository.save(entity);
    }
}
