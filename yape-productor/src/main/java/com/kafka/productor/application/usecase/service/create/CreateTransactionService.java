package com.kafka.productor.application.usecase.service.create;

import java.util.UUID;

import com.kafka.productor.application.usecase.command.CreateTransactionCommand;
import com.kafka.productor.domain.model.Transaction;
import com.kafka.productor.domain.model.TransactionType;
import com.kafka.productor.domain.port.EventPublisherPort;
import com.kafka.productor.domain.port.TransactionRepositoryPort;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class CreateTransactionService implements CreateTransactionUseCase {

    private final TransactionRepositoryPort repository;
    private final EventPublisherPort eventPublisher;

    public CreateTransactionService(
            TransactionRepositoryPort repository,
            EventPublisherPort eventPublisher) {
        this.repository = repository;
        this.eventPublisher = eventPublisher;
    }

    @Override
    public UUID execute(CreateTransactionCommand command) {
        UUID transactionExternalId = UUID.randomUUID();
        Transaction transaction = new Transaction(
                transactionExternalId,
                command.accountExternalIdDebit(),
                command.accountExternalIdCredit(),
                new TransactionType(command.transferTypeId(), "TRANSFER"),
                command.value());

        log.info("Creating transaction with externalId: {}", transactionExternalId);
        repository.save(transaction);

        eventPublisher.publishTransactionCreated(transaction);

        return transactionExternalId;
    }
}
