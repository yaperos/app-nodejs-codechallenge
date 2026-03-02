package com.yape.transaction.domain.service;

import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.model.TransactionStatus;
import com.yape.transaction.domain.port.in.CreateTransactionUseCase;
import com.yape.transaction.domain.port.in.GetTransactionUseCase;
import com.yape.transaction.domain.port.in.UpdateTransactionStatusUseCase;
import com.yape.transaction.domain.port.out.TransactionCachePort;
import com.yape.transaction.domain.port.out.TransactionEventPublisher;
import com.yape.transaction.domain.port.out.TransactionRepositoryPort;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.jboss.logging.Logger;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class TransactionService implements CreateTransactionUseCase, 
                                          GetTransactionUseCase, 
                                          UpdateTransactionStatusUseCase {

    private static final Logger LOG = Logger.getLogger(TransactionService.class);

    private final TransactionRepositoryPort repository;
    private final TransactionEventPublisher eventPublisher;
    private final TransactionCachePort cache;

    @Inject
    public TransactionService(TransactionRepositoryPort repository,
                             TransactionEventPublisher eventPublisher,
                             TransactionCachePort cache) {
        this.repository = repository;
        this.eventPublisher = eventPublisher;
        this.cache = cache;
    }

    @Override
    @Transactional
    public Transaction createTransaction(UUID accountExternalIdDebit, UUID accountExternalIdCredit,
                                        Integer transferTypeId, BigDecimal value) {
        LOG.infof("Creating transaction: debit=%s, credit=%s, type=%d, value=%s",
                accountExternalIdDebit, accountExternalIdCredit, transferTypeId, value);

        Transaction transaction = new Transaction(
                accountExternalIdDebit,
                accountExternalIdCredit,
                transferTypeId,
                value
        );

        Transaction savedTransaction = repository.save(transaction);
        LOG.infof("Transaction saved with ID: %s", savedTransaction.getTransactionExternalId());

        cache.put(savedTransaction);

        eventPublisher.publishTransactionCreated(savedTransaction);
        LOG.infof("Transaction created event published for ID: %s", savedTransaction.getTransactionExternalId());

        return savedTransaction;
    }

    @Override
    public Optional<Transaction> getTransaction(UUID transactionExternalId) {
        LOG.infof("Retrieving transaction: %s", transactionExternalId);

        Optional<Transaction> cachedTransaction = cache.get(transactionExternalId);
        if (cachedTransaction.isPresent()) {
            LOG.infof("Transaction found in cache: %s", transactionExternalId);
            return cachedTransaction;
        }

        Optional<Transaction> transaction = repository.findByExternalId(transactionExternalId);
        
        transaction.ifPresent(cache::put);

        return transaction;
    }

    @Override
    @Transactional
    public void updateStatus(UUID transactionExternalId, TransactionStatus status) {
        LOG.infof("Updating transaction status: %s -> %s", transactionExternalId, status);

        Optional<Transaction> transactionOpt = repository.findByExternalId(transactionExternalId);
        
        if (transactionOpt.isEmpty()) {
            LOG.warnf("Transaction not found: %s", transactionExternalId);
            return;
        }

        Transaction transaction = transactionOpt.get();
        
        if (!transaction.isPending()) {
            LOG.warnf("Transaction %s is not pending, current status: %s", 
                    transactionExternalId, transaction.getStatus());
            return;
        }

        transaction.setStatus(status);
        repository.update(transaction);

        cache.invalidate(transactionExternalId);
        cache.put(transaction);

        LOG.infof("Transaction %s status updated to: %s", transactionExternalId, status);
    }
}
