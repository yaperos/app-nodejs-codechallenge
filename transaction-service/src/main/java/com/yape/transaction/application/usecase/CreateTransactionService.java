package com.yape.transaction.application.usecase;

import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.port.in.CreateTransactionUseCase;
import com.yape.transaction.domain.port.out.TransactionEventPublisher;
import com.yape.transaction.domain.port.out.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CreateTransactionService implements CreateTransactionUseCase {

    private final TransactionRepository transactionRepository;
    private final TransactionEventPublisher eventPublisher;

    public CreateTransactionService(TransactionRepository transactionRepository,
                                    TransactionEventPublisher eventPublisher) {
        this.transactionRepository = transactionRepository;
        this.eventPublisher = eventPublisher;
    }

    @Override
    @Transactional
    public Transaction execute(Command command) {
        Transaction transaction = Transaction.create(
                command.accountExternalIdDebit(),
                command.accountExternalIdCredit(),
                command.transferTypeId(),
                command.value()
        );

        Transaction saved = transactionRepository.save(transaction);

        // Publish event to Kafka → Anti-Fraud will consume it
        eventPublisher.publishTransactionCreated(saved);

        return saved;
    }
}
