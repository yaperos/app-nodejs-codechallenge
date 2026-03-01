package com.retotecnico.transaction.infrastructure.adapter.out.persistence;

import com.retotecnico.transaction.domain.model.Transaction;
import com.retotecnico.transaction.domain.port.out.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

/**
 * Adapter implementing the output port for persistence using JPA.
 */
@Component
@RequiredArgsConstructor
public class JpaTransactionRepositoryAdapter implements TransactionRepository {

    private final SpringDataTransactionRepository springDataRepository;

    @Override
    public Transaction save(Transaction transaction) {
        TransactionJpaEntity entity = TransactionMapper.toJpaEntity(transaction);
        TransactionJpaEntity saved = springDataRepository.save(entity);
        return TransactionMapper.toDomain(saved);
    }

    @Override
    public Optional<Transaction> findById(UUID transactionExternalId) {
        return springDataRepository.findById(transactionExternalId)
                .map(TransactionMapper::toDomain);
    }
}
