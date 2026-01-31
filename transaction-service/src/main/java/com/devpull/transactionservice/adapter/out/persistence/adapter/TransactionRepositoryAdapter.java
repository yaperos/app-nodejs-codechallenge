package com.devpull.transactionservice.adapter.out.persistence.adapter;

import com.devpull.transactionservice.adapter.out.persistence.mapper.TransactionPersistenceMapper;
import com.devpull.transactionservice.adapter.out.persistence.repository.R2dbcTransactionRepository;
import com.devpull.transactionservice.application.port.out.TransactionRepositoryPort;
import com.devpull.transactionservice.domain.model.Transaction;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Component
public class TransactionRepositoryAdapter implements TransactionRepositoryPort {

    private final R2dbcTransactionRepository repository;

    public TransactionRepositoryAdapter(R2dbcTransactionRepository repository) {
        this.repository = repository;
    }

    @Override
    public Mono<Transaction> save(Transaction tx) {
        return repository.save(TransactionPersistenceMapper.toNewEntity(tx))
                .map(TransactionPersistenceMapper::toDomain);
    }

    @Override
    public Mono<Transaction> update(Transaction tx) {
        return repository.save(TransactionPersistenceMapper.toExistingEntity(tx))
                .map(TransactionPersistenceMapper::toDomain);
    }


    @Override
    public Mono<Transaction> findById(UUID id) {
        return repository.findById(id)
                .map(TransactionPersistenceMapper::toDomain);
    }
}
