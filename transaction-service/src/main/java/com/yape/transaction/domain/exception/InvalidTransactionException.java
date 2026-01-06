package com.yape.transaction.domain.exception;

/**
 * Excepción cuando los datos de la transacción son inválidos
 */
public class InvalidTransactionException extends DomainException {

    public InvalidTransactionException(String message) {
        super(message);
    }
}

