package com.yape.transaction.application.usecase;

import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.model.TransactionStatus;
import com.yape.transaction.domain.port.in.CreateTransactionUseCase;
import com.yape.transaction.domain.port.out.TransactionEventPublisher;
import com.yape.transaction.domain.port.out.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CreateTransactionUseCaseImpl implements CreateTransactionUseCase {

    private final TransactionRepository transactionRepository;
    private final TransactionEventPublisher transactionEventPublisher;

    @Override
    public Transaction create(Transaction transaction) {
        transaction.setExternalId(UUID.randomUUID());
        transaction.setStatus(TransactionStatus.PENDING);
        transaction.setCreatedAt(LocalDateTime.now());

        Transaction savedTransaction = transactionRepository.save(transaction);
        log.info("Transaction created with externalId: {}", savedTransaction.getExternalId());

        transactionEventPublisher.publishTransactionCreated(savedTransaction);
        log.info("Transaction created event published for externalId: {}", savedTransaction.getExternalId());

        return savedTransaction;
    }
}
