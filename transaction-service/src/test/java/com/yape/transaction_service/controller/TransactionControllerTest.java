package com.yape.transaction_service.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yape.transaction_service.dto.CreateTransactionRequest;
import com.yape.transaction_service.dto.GetTransactionResponse;
import com.yape.transaction_service.service.TransactionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("Tests del TransactionController")
class TransactionControllerTest {

    @Mock
    private TransactionService transactionService;

    @InjectMocks
    private TransactionController controller;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
    }

    @Test
    @DisplayName("POST /transactions - Debe crear una transacción exitosamente")
    void shouldCreateTransactionSuccessfully() {
        // Arrange
        CreateTransactionRequest request = new CreateTransactionRequest(
                UUID.randomUUID(),
                UUID.randomUUID(),
                1,
                new BigDecimal("500.00")
        );

        GetTransactionResponse expectedResponse = new GetTransactionResponse(
                UUID.randomUUID(),
                new GetTransactionResponse.TransactionType("TRANSFERENCIA"),
                new GetTransactionResponse.TransactionStatusResponse("pendiente"),
                new BigDecimal("500.00"),
                LocalDateTime.now()
        );

        when(transactionService.create(any(CreateTransactionRequest.class)))
                .thenReturn(expectedResponse);

        ResponseEntity<GetTransactionResponse> response = controller.create(request);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(expectedResponse.transactionExternalId(),
                response.getBody().transactionExternalId());
        assertEquals("TRANSFERENCIA", response.getBody().transactionType().name());
        assertEquals("pendiente", response.getBody().transactionStatus().name());
        assertEquals(new BigDecimal("500.00"), response.getBody().value());
    }

    @Test
    @DisplayName("GET /transactions/{id} - Debe retornar una transacción existente")
    void shouldReturnExistingTransaction() {
        UUID transactionId = UUID.randomUUID();
        GetTransactionResponse expectedResponse = new GetTransactionResponse(
                transactionId,
                new GetTransactionResponse.TransactionType("TRANSFERENCIA"),
                new GetTransactionResponse.TransactionStatusResponse("aprobado"),
                new BigDecimal("500.00"),
                LocalDateTime.now()
        );

        when(transactionService.getByExternalId(transactionId))
                .thenReturn(expectedResponse);

        ResponseEntity<GetTransactionResponse> response = controller.get(transactionId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(transactionId, response.getBody().transactionExternalId());
        assertEquals("aprobado", response.getBody().transactionStatus().name());
    }

    @Test
    @DisplayName("GET /transactions/{id} - Debe manejar error cuando no existe")
    void shouldHandleNotFound() {
        UUID transactionId = UUID.randomUUID();
        when(transactionService.getByExternalId(transactionId))
                .thenThrow(new RuntimeException("Transaction not found"));

        assertThrows(RuntimeException.class, () -> {
            controller.get(transactionId);
        });
    }
}