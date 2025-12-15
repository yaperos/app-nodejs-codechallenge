package com.transaction.app.infrastructure.persistence.adapter;

import com.transaction.app.domain.model.TransactionModel;
import com.transaction.app.domain.model.TransactionStatus;
import com.transaction.app.domain.port.out.TransactionRepositoryPort;
import com.transaction.app.infrastructure.mapper.TransactionMapper;
import com.transaction.app.infrastructure.persistence.entity.TransactionEntity;
import com.transaction.app.infrastructure.persistence.repository.TransactionJpaRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
@AllArgsConstructor
public class TransactionRepositoryAdapter implements TransactionRepositoryPort {

    private final TransactionJpaRepository repository;
    private final TransactionMapper mapper;

    @Override
    public TransactionModel save(TransactionModel model) {
        return mapper.toModel(
                repository.save(mapper.toEntity(model))
        );
    }

    @Override
    public Optional<TransactionModel> findByExternalId(UUID externalId) {
        return repository.findByTransactionExternalId(externalId)
                .map(mapper::toModel);
    }

    @Override
    public void updateStatus(UUID externalId, TransactionStatus status) {
        TransactionEntity entity = repository.findByTransactionExternalId(externalId)
                .orElseThrow();
        entity.setStatus(status);
        repository.save(entity);
    }
}
