package com.yape.transaction.application.service;

import com.yape.transaction.application.port.in.CreateTransactionUseCase;
import com.yape.transaction.application.port.in.GetTransactionUseCase;
import com.yape.transaction.application.port.out.TransactionEventPublisherPort;
import com.yape.transaction.application.port.out.TransactionRepositoryPort;
import com.yape.transaction.domain.exception.TransactionNotFoundException;
import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.model.TransactionStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class TransactionService implements CreateTransactionUseCase, GetTransactionUseCase {

    private final TransactionRepositoryPort transactionRepository;
    private final TransactionEventPublisherPort transactionEventPublisher;

    @Override
    @Transactional
    public Transaction createTransaction(Transaction transaction) {
        log.info("Creating transaction for account: {}", transaction.getAccountExternalIdDebit());

        // Initial status is PENDING
        transaction.setStatus(TransactionStatus.PENDING);

        // Save to database
        Transaction savedTransaction = transactionRepository.save(transaction);

        // Publish event to Kafka
        transactionEventPublisher.publishTransactionCreated(savedTransaction);

        return savedTransaction;
    }

    @Override
    @Transactional(readOnly = true)
    public Transaction getTransaction(UUID transactionExternalId) {
        return transactionRepository.findById(transactionExternalId)
                .orElseThrow(() -> new TransactionNotFoundException("Transaction not found with id: " + transactionExternalId));
    }
}
