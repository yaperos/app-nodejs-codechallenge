package com.yape.transaction.domain.exception;

import java.util.UUID;

/**
 * Excepción cuando no se encuentra una transacción
 */
public class TransactionNotFoundException extends DomainException {

    public TransactionNotFoundException(UUID transactionExternalId) {
        super("Transaction not found with id: " + transactionExternalId);
    }
}

