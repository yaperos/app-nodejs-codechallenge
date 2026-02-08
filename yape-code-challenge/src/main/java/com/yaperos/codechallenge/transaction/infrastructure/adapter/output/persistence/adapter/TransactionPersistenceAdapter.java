package com.yaperos.codechallenge.transaction.infrastructure.adapter.output.persistence.adapter;

import com.yaperos.codechallenge.transaction.domain.model.Transaction;
import com.yaperos.codechallenge.transaction.domain.port.output.TransactionRepositoryPort;
import com.yaperos.codechallenge.transaction.infrastructure.adapter.output.persistence.mapper.TransactionPersistenceMapper;
import com.yaperos.codechallenge.transaction.infrastructure.adapter.output.persistence.repository.SpringDataTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class TransactionPersistenceAdapter implements TransactionRepositoryPort {

    private final SpringDataTransactionRepository repository;
    private final TransactionPersistenceMapper mapper;

    @Override
    public Transaction save(Transaction transaction) {
        var entity = mapper.toJpaEntity(transaction);
        var saved = repository.save(entity);
        return mapper.toDomain(saved);
    }

    @Override
    public Optional<Transaction> findById(UUID transactionExternalId) {
        return repository.findById(transactionExternalId)
                .map(mapper::toDomain);
    }

}
