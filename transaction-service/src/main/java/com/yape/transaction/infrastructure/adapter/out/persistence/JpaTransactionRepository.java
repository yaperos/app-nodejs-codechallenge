package com.yape.transaction.infrastructure.adapter.out.persistence;

import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.port.out.TransactionRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public class JpaTransactionRepository implements TransactionRepository {

    private final SpringDataTransactionRepository springDataRepository;

    public JpaTransactionRepository(SpringDataTransactionRepository springDataRepository) {
        this.springDataRepository = springDataRepository;
    }

    @Override
    public Transaction save(Transaction transaction) {
        var entity = TransactionPersistenceMapper.toJpaEntity(transaction);
        entity = springDataRepository.save(entity);
        return TransactionPersistenceMapper.toDomain(entity);
    }

    @Override
    public Optional<Transaction> findById(UUID transactionId) {
        return springDataRepository.findById(transactionId)
                .map(TransactionPersistenceMapper::toDomain);
    }
}
