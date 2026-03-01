package com.retotecnico.transaction.application.service;

import com.retotecnico.transaction.domain.model.Transaction;
import com.retotecnico.transaction.domain.port.in.CreateTransactionUseCase;
import com.retotecnico.transaction.domain.port.out.TransactionCacheRepository;
import com.retotecnico.transaction.domain.port.out.TransactionEventPublisher;
import com.retotecnico.transaction.domain.port.out.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CreateTransactionService implements CreateTransactionUseCase {

    private final TransactionRepository transactionRepository;
    private final TransactionEventPublisher transactionEventPublisher;
    private final TransactionCacheRepository transactionCacheRepository;

    @Override
    @Transactional
    public Transaction execute(UUID accountExternalIdDebit,
                               UUID accountExternalIdCredit,
                               int transferTypeId,
                               BigDecimal value) {

        // 1. Create domain entity with PENDING status
        Transaction transaction = Transaction.create(
                accountExternalIdDebit,
                accountExternalIdCredit,
                transferTypeId,
                value
        );

        // 2. Save to PostgreSQL (Write model)
        Transaction saved = transactionRepository.save(transaction);
        log.info("Transaction saved with id: {} and status: {}",
                saved.getTransactionExternalId(), saved.getStatus());

        // 3. Save to Redis (Read model - CQRS)
        transactionCacheRepository.save(saved);

        // 4. Publish event to Kafka for Anti-Fraud validation
        transactionEventPublisher.publishTransactionCreated(saved);
        log.info("Transaction event published for id: {}", saved.getTransactionExternalId());

        return saved;
    }
}
