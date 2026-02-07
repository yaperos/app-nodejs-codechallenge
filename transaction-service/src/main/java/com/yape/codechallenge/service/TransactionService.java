package com.yape.codechallenge.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.eclipse.microprofile.reactive.messaging.Channel;
import org.eclipse.microprofile.reactive.messaging.Emitter;
import org.eclipse.microprofile.reactive.messaging.Incoming;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.yape.codechallenge.event.TransactionEvent;
import com.yape.codechallenge.model.Transaction;
import com.yape.codechallenge.repository.TransactionRepository;
import com.yape.codechallenge.request.CreateTransactionRequest;

import java.io.IOException;
import java.util.UUID;

@ApplicationScoped
public class TransactionService {

    @Inject
    @Channel("transaction-created-out")
    Emitter<TransactionEvent> transactionEmitter;

    @Inject
    ObjectMapper objectMapper;

    @Inject
    TransactionRepository transactionRepository;

    @Transactional
    public Transaction createTransaction(CreateTransactionRequest request) {
        Transaction transaction = new Transaction(
                request.accountExternalIdDebit,
                request.accountExternalIdCredit,
                request.transferTypeId,
                request.value);
        transactionRepository.save(transaction);

        TransactionEvent event = new TransactionEvent(transaction.transactionExternalId, transaction.value,
                transaction.status);
        transactionEmitter.send(event);

        return transaction;
    }

    public Transaction getTransaction(UUID id) {
        return transactionRepository.findById(id);
    }

    @Incoming("transaction-status-in")
    @Transactional
    public void consumeStatusUpdate(String eventJson) {
        try {
            TransactionEvent event = objectMapper.readValue(eventJson, TransactionEvent.class);

            Transaction transaction = transactionRepository.findById(event.transactionExternalId());
            if (transaction != null) {
                transaction.status = event.status();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
