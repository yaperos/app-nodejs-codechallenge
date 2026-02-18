package com.jotace.transaction.application.service;

import com.jotace.transaction.application.port.in.TransactionCreationUseCase;
import com.jotace.transaction.application.port.in.TransactionRetrievalUseCase;
import com.jotace.transaction.application.port.out.EventProducerPort;
import com.jotace.transaction.application.port.out.TransactionRepositoryPort;
import com.jotace.transaction.domain.model.Transaction;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class TransactionService implements TransactionCreationUseCase, TransactionRetrievalUseCase {

    // Injecting Output Ports (depends on contracts, not implementations)
    private final TransactionRepositoryPort transactionRepositoryPort;
    private final EventProducerPort eventProducer;

    public TransactionService(TransactionRepositoryPort transactionRepositoryPort, EventProducerPort eventProducer) {
        this.transactionRepositoryPort = transactionRepositoryPort;
        this.eventProducer = eventProducer;
    }

    @Override
    public Transaction createTransaction(String accountExternalIdDebit, String accountExternalIdCredit, int transferTypeId, double value) {
        // 1. Create the domain entity with initial state 'pending'
        Transaction newTransaction = new Transaction(accountExternalIdDebit, accountExternalIdCredit, transferTypeId, value);

        // 2. Persist the entity into the database (using the TransactionRepositoryPort)
        Transaction savedTransaction = transactionRepositoryPort.save(newTransaction);

        // 3. Publish the event to Kafka (using the EventProducerPort)
        eventProducer.sendTransactionCreatedEvent(savedTransaction);

        // 4. Return the created transaction back to the REST adapter
        return savedTransaction;
    }

    @Override
    public Transaction getTransactionById(UUID uuid) {
        return transactionRepositoryPort.findByExternalId(uuid).orElse(null);
    }
}
