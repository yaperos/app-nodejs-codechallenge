package com.yape.transaction.application.usecase;

import java.util.UUID;

public class TransactionNotFoundException extends RuntimeException {

    public TransactionNotFoundException(UUID transactionExternalId) {
        super("Transaction not found with id: " + transactionExternalId);
    }
}
