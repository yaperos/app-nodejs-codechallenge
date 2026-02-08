package com.yaperos.codechallenge.transaction.domain.exception;

public class InvalidTransferTypeException extends RuntimeException {

    public InvalidTransferTypeException(int id) {
        super("Unknown transfer type id: " + id);
    }

}
