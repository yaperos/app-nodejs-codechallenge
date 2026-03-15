package com.challenge.transaction.core.usecase;

import com.challenge.transaction.core.domain.enums.TransactionStatus;
import com.challenge.transaction.core.domain.model.Transaction;
import com.challenge.transaction.core.ports.input.CreateTransactionUseCase;
import com.challenge.transaction.core.ports.output.TransactionEventPublisher;
import com.challenge.transaction.core.ports.output.TransactionRepository;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@RequiredArgsConstructor
public class CreateTransactionService implements CreateTransactionUseCase {

    private final TransactionRepository repository;
    private final TransactionEventPublisher publisher;

    @Override
    public Transaction create(Transaction transaction) {
        transaction.setTransactionExternalId(UUID.randomUUID());
        transaction.setStatus(TransactionStatus.PENDING);
        transaction.setCreatedAt(LocalDateTime.now());

        Transaction saved = repository.save(transaction);

        publisher.publishTransactionCreated(saved);

        return saved;
    }

}
