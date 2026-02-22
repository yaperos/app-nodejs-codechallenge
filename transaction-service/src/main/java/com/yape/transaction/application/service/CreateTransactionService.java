package com.yape.transaction.application.service;

import com.yape.transaction.domain.event.TransactionCreatedEvent;
import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.port.in.CreateTransactionCommand;
import com.yape.transaction.domain.port.in.CreateTransactionUseCase;
import com.yape.transaction.domain.port.out.TransactionEventPublisher;
import com.yape.transaction.domain.port.out.TransactionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CreateTransactionService implements CreateTransactionUseCase {

    private static final Logger log = LoggerFactory.getLogger(CreateTransactionService.class);

    private final TransactionRepository repository;
    private final TransactionEventPublisher eventPublisher;

    public CreateTransactionService(TransactionRepository repository,
                                    TransactionEventPublisher eventPublisher) {
        this.repository = repository;
        this.eventPublisher = eventPublisher;
    }

    @Override
    @Transactional
    public Transaction execute(CreateTransactionCommand command) {
        Transaction transaction = Transaction.create(
                command.accountExternalIdDebit(),
                command.accountExternalIdCredit(),
                command.transferTypeId(),
                command.value()
        );

        transaction = repository.save(transaction);
        log.info("event=transaction.created, transactionId={}, value={}, status={}, outcome=success",
                transaction.getId(), transaction.getValue(), transaction.getStatus());

        eventPublisher.publishTransactionCreated(new TransactionCreatedEvent(
                transaction.getId(),
                transaction.getValue()
        ));

        return transaction;
    }
}
