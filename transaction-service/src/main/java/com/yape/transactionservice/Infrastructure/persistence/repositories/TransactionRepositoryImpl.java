package com.yape.transactionservice.Infrastructure.persistence.repositories;

import com.yape.transactionservice.Infrastructure.persistence.mappers.TransactionEntityMapper;
import com.yape.transactionservice.domain.models.Transaction;
import com.yape.transactionservice.domain.repostories.TransactionRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class TransactionRepositoryImpl implements TransactionRepository {
    private final TransactionEntityMapper mapper;
    private final TransactionJpaRepository transactionJpaRepository;

    public TransactionRepositoryImpl(TransactionEntityMapper mapper,
                                     TransactionJpaRepository transactionJpaRepository
    ) {
        this.mapper = mapper;
        this.transactionJpaRepository = transactionJpaRepository;
    }

    @Override
    public Optional<Transaction> getById(UUID id) {
        return transactionJpaRepository.findById(id)
                                       .map(mapper::toModel);

    }

    @Override
    public Transaction save(Transaction transaction) {
        var entity = mapper.toEntity(transaction);
        var Transaction = transactionJpaRepository.save(entity);

        return mapper.toModel(Transaction);
    }

    @Override
    public List<Transaction> getAll() {
        var transactionEntities = transactionJpaRepository.findAll();
        return mapper.toModels(transactionEntities);
    }
}
