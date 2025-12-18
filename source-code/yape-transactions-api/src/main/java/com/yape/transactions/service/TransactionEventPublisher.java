package com.yape.transactions.service;

import com.yape.transactions.dto.TransactionCreatedEvent;

import java.util.concurrent.ExecutionException;

public interface TransactionEventPublisher {

    void createTransactionEvent(TransactionCreatedEvent transactionCreatedEvent)
            throws ExecutionException, InterruptedException;
}
