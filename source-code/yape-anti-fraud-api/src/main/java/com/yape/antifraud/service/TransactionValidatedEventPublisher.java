package com.yape.antifraud.service;

import com.yape.antifraud.dto.TransactionValidatedEvent;

public interface TransactionValidatedEventPublisher {

    void createTransactionValidatedEvent(TransactionValidatedEvent transactionValidatedEvent)
            throws Exception;
}
