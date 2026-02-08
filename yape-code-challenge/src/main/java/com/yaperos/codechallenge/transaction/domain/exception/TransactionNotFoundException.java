package com.yaperos.codechallenge.transaction.domain.exception;

import java.util.UUID;

public class TransactionNotFoundException extends RuntimeException {

    public TransactionNotFoundException(UUID transactionExternalId) {
        super("Transaction not found: " + transactionExternalId);
    }

}
