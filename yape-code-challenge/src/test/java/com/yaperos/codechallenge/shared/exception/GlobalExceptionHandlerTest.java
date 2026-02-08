package com.yaperos.codechallenge.shared.exception;

import com.yaperos.codechallenge.transaction.domain.exception.InvalidTransferTypeException;
import com.yaperos.codechallenge.transaction.domain.exception.TransactionNotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void handleTransactionNotFound_shouldReturn404() {
        UUID id = UUID.randomUUID();
        TransactionNotFoundException ex = new TransactionNotFoundException(id);

        ResponseEntity<ErrorResponse> response = handler.handleTransactionNotFound(ex);

        assertEquals(404, response.getStatusCode().value());
        assertEquals("Not Found", response.getBody().getError());
        assertTrue(response.getBody().getMessage().contains(id.toString()));
    }

    @Test
    void handleInvalidTransferType_shouldReturn400() {
        InvalidTransferTypeException ex = new InvalidTransferTypeException(999);

        ResponseEntity<ErrorResponse> response = handler.handleInvalidTransferType(ex);

        assertEquals(400, response.getStatusCode().value());
        assertEquals("Bad Request", response.getBody().getError());
        assertTrue(response.getBody().getMessage().contains("999"));
    }

    @Test
    void handleGeneric_shouldReturn500() {
        Exception ex = new RuntimeException("something broke");

        ResponseEntity<ErrorResponse> response = handler.handleGeneric(ex);

        assertEquals(500, response.getStatusCode().value());
        assertEquals("Internal Server Error", response.getBody().getError());
        assertEquals("An unexpected error occurred", response.getBody().getMessage());
    }

}
