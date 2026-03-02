package com.yape.transaction.infrastructure.adapter.out.persistence;

import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.port.out.TransactionRepositoryPort;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.jboss.logging.Logger;

import java.util.Optional;
import java.util.UUID;


@ApplicationScoped
public class TransactionRepositoryAdapter implements TransactionRepositoryPort {

    private static final Logger LOG = Logger.getLogger(TransactionRepositoryAdapter.class);

    private final TransactionMapper mapper;

    @Inject
    public TransactionRepositoryAdapter(TransactionMapper mapper) {
        this.mapper = mapper;
    }

    @Override
    public Transaction save(Transaction transaction) {
        LOG.debugf("Saving transaction: %s", transaction.getTransactionExternalId());
        
        TransactionEntity entity = mapper.toEntity(transaction);
        entity.persist();
        
        LOG.debugf("Transaction persisted with ID: %d", entity.getId());
        return mapper.toDomain(entity);
    }

    @Override
    public Optional<Transaction> findByExternalId(UUID transactionExternalId) {
        LOG.debugf("Finding transaction by external ID: %s", transactionExternalId);
        
        TransactionEntity entity = TransactionEntity.findByExternalId(transactionExternalId);
        
        if (entity == null) {
            LOG.debugf("Transaction not found: %s", transactionExternalId);
            return Optional.empty();
        }
        
        return Optional.of(mapper.toDomain(entity));
    }

    @Override
    public Transaction update(Transaction transaction) {
        LOG.debugf("Updating transaction: %s", transaction.getTransactionExternalId());
        
        TransactionEntity entity = TransactionEntity.findByExternalId(transaction.getTransactionExternalId());
        
        if (entity == null) {
            throw new IllegalArgumentException("Transaction not found: " + transaction.getTransactionExternalId());
        }
        
        mapper.updateEntity(entity, transaction);
        entity.persist();
        
        LOG.debugf("Transaction updated: %s", transaction.getTransactionExternalId());
        return mapper.toDomain(entity);
    }
}
