package com.yape.transactions.service.impl;

import com.yape.transactions.domain.TransactionStatus;
import com.yape.transactions.entity.TransactionEntity;
import com.yape.transactions.repository.TransactionRepository;
import com.yape.transactions.service.TransactionPersistence;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class TransactionPersistenceImpl implements TransactionPersistence {

    private final TransactionRepository transactionRepository;

    public TransactionPersistenceImpl(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @Override
    public TransactionEntity saveTransaction(TransactionEntity transactionEntity) {
        return transactionRepository.save(transactionEntity);
    }

    @Override
    public TransactionEntity findByTransactionExternalId(UUID transactionExternalId) {
        return transactionRepository.findByTransactionExternalId(transactionExternalId)
                .orElse(null);
    }

    @Override
    public TransactionEntity updateTransactionStatus(TransactionEntity transactionEntity, String status) {
        transactionEntity.setTransactionStatus(TransactionStatus.valueOf(status));
        return transactionRepository.save(transactionEntity);
    }
}
