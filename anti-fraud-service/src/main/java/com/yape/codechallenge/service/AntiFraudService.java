package com.yape.codechallenge.service;

import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.reactive.messaging.Incoming;
import org.eclipse.microprofile.reactive.messaging.Outgoing;

import com.yape.codechallenge.event.TransactionEvent;

import io.smallrye.reactive.messaging.annotations.Blocking;

@ApplicationScoped
public class AntiFraudService {

    @Incoming("transaction-created-in")
    @Outgoing("transaction-status-out")
    @Blocking
    public TransactionEvent validateTransaction(TransactionEvent event) {

        String newStatus = event.value() > 1000
                ? "rejected"
                : "approved";

        return new TransactionEvent(
                event.transactionExternalId(),
                event.value(),
                newStatus);
    }
}
