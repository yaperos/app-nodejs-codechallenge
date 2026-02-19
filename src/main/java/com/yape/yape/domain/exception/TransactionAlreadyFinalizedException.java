package com.yape.yape.domain.exception;

public class TransactionAlreadyFinalizedException extends RuntimeException {
    public TransactionAlreadyFinalizedException(String message) {
        super(message);
    }
}
