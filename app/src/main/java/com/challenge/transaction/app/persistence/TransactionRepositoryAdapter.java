package com.challenge.transaction.app.persistence;

import com.challenge.transaction.core.domain.enums.TransactionStatus;
import com.challenge.transaction.core.domain.model.Transaction;
import com.challenge.transaction.core.ports.output.TransactionRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Slf4j
@Component
@AllArgsConstructor
public class TransactionRepositoryAdapter implements TransactionRepository {

    private final TransactionJpaRepository repository;

    @Override
    public Transaction save(Transaction transaction) {
        log.info("[TRANSACTION-SAVE] init...");
        TransactionEntity entity = new TransactionEntity();

        entity.setTransactionExternalId(transaction.getTransactionExternalId());
        entity.setValue(transaction.getValue());
        entity.setStatus(transaction.getStatus().name());
        entity.setCreatedAt(transaction.getCreatedAt());

        repository.save(entity);

        log.info("[TRANSACTION-SAVE] transactionExternalId: {}", transaction.getTransactionExternalId());
        log.info("[TRANSACTION-SAVE] end.");

        return transaction;
    }

    @Override
    public Optional<Transaction> findByExternalId(UUID id) {
        return repository.findById(id).map(e -> {
            Transaction t = new Transaction();
            t.setTransactionExternalId(e.getTransactionExternalId());
            t.setValue(e.getValue());
            return t;
        });
    }

    @Override
    public void updateStatus(UUID id, String status) {

        repository.findById(id).ifPresent(entity -> {
            entity.setStatus(status);
            repository.save(entity);
        });
    }
}
