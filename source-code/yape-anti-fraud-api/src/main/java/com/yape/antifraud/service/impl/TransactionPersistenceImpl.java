package com.yape.antifraud.service.impl;

import com.yape.antifraud.entity.TransactionEntity;
import com.yape.antifraud.repository.TransactionRepository;
import com.yape.antifraud.service.TransactionPersistence;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class TransactionPersistenceImpl implements TransactionPersistence {

    private final TransactionRepository transactionRepository;

    public TransactionPersistenceImpl(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @Override
    public TransactionEntity findByTransactionExternalId(UUID transactionExternalId) {
        return transactionRepository.findByTransactionExternalId(transactionExternalId)
                .orElse(null);
    }
}
