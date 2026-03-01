package com.yape.transactionservice.application.usecases.createtransaction;

import com.yape.transactionservice.application.abstractions.TransactionEventPublisher;
import com.yape.transactionservice.domain.events.TransactionCreatedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
public class TransactionCreatedEventHandler {
    private final TransactionEventPublisher transactionEventPublisher;

    public TransactionCreatedEventHandler(TransactionEventPublisher transactionEventPublisher) {
        this.transactionEventPublisher = transactionEventPublisher;
    }

    @Async
    @EventListener
    public void handle(TransactionCreatedEvent event) {
        transactionEventPublisher.publishTransactionCreated(event.transaction());
    }
}
