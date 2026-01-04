package com.yape.challenge.transaction.presentation.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yape.challenge.transaction.application.bus.CommandBus;
import com.yape.challenge.transaction.application.bus.QueryBus;
import com.yape.challenge.transaction.application.command.CreateTransactionCommand;
import com.yape.challenge.transaction.application.dto.request.CreateTransactionRequest;
import com.yape.challenge.transaction.application.dto.response.TransactionResponse;
import com.yape.challenge.transaction.application.query.GetTransactionQuery;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TransactionController.class)
@DisplayName("Transaction Controller Tests")
class TransactionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CommandBus commandBus;

    @MockBean
    private QueryBus queryBus;

    private UUID transactionId;
    private UUID debitAccountId;
    private UUID creditAccountId;
    private CreateTransactionRequest createRequest;
    private TransactionResponse transactionResponse;

    @BeforeEach
    void setUp() {
        transactionId = UUID.randomUUID();
        debitAccountId = UUID.randomUUID();
        creditAccountId = UUID.randomUUID();

        createRequest = CreateTransactionRequest.builder()
                .accountExternalIdDebit(debitAccountId)
                .accountExternalIdCredit(creditAccountId)
                .tranferTypeId(1)
                .value(new BigDecimal("500.00"))
                .build();

        transactionResponse = TransactionResponse.builder()
                .transactionExternalId(transactionId)
                .transactionType(TransactionResponse.TransactionTypeDto.builder()
                        .name("Tipo A")
                        .build())
                .transactionStatus(TransactionResponse.TransactionStatusDto.builder()
                        .name("PENDING")
                        .build())
                .value(new BigDecimal("500.00"))
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("Should create transaction successfully")
    void shouldCreateTransactionSuccessfully() throws Exception {
        // Given
        when(commandBus.dispatch(any(CreateTransactionCommand.class)))
                .thenReturn(transactionResponse);

        // When & Then
        mockMvc.perform(post("/api/v1/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.transactionExternalId").value(transactionId.toString()))
                .andExpect(jsonPath("$.transactionStatus.name").value("PENDING"))
                .andExpect(jsonPath("$.value").value(500.00))
                .andExpect(jsonPath("$.transactionType.name").value("Tipo A"));

        verify(commandBus, times(1)).dispatch(any(CreateTransactionCommand.class));
    }

    @Test
    @DisplayName("Should return bad request when request is invalid")
    void shouldReturnBadRequestWhenRequestIsInvalid() throws Exception {
        // Given
        CreateTransactionRequest invalidRequest = CreateTransactionRequest.builder()
                .accountExternalIdDebit(null) // Required field missing
                .accountExternalIdCredit(creditAccountId)
                .tranferTypeId(1)
                .value(new BigDecimal("500.00"))
                .build();

        // When & Then
        mockMvc.perform(post("/api/v1/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());

        verify(commandBus, never()).dispatch(any(CreateTransactionCommand.class));
    }

    @Test
    @DisplayName("Should get transaction by external id")
    void shouldGetTransactionByExternalId() throws Exception {
        // Given
        when(queryBus.dispatch(any(GetTransactionQuery.class)))
                .thenReturn(transactionResponse);

        // When & Then
        mockMvc.perform(get("/api/v1/transactions/{externalId}", transactionId))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.transactionExternalId").value(transactionId.toString()))
                .andExpect(jsonPath("$.transactionStatus.name").value("PENDING"))
                .andExpect(jsonPath("$.value").value(500.00));

        verify(queryBus, times(1)).dispatch(any(GetTransactionQuery.class));
    }

    @Test
    @DisplayName("Should handle valid UUID path variable")
    void shouldHandleValidUuidPathVariable() throws Exception {
        // Given
        when(queryBus.dispatch(any(GetTransactionQuery.class)))
                .thenReturn(transactionResponse);

        // When & Then
        mockMvc.perform(get("/api/v1/transactions/{externalId}", transactionId.toString()))
                .andExpect(status().isOk());

        verify(queryBus, times(1)).dispatch(any(GetTransactionQuery.class));
    }

    @Test
    @DisplayName("Should create transaction with minimum valid value")
    void shouldCreateTransactionWithMinimumValidValue() throws Exception {
        // Given
        CreateTransactionRequest minValueRequest = CreateTransactionRequest.builder()
                .accountExternalIdDebit(debitAccountId)
                .accountExternalIdCredit(creditAccountId)
                .tranferTypeId(1)
                .value(new BigDecimal("0.01"))
                .build();

        TransactionResponse minValueResponse = TransactionResponse.builder()
                .transactionExternalId(transactionId)
                .transactionType(TransactionResponse.TransactionTypeDto.builder()
                        .name("Tipo A")
                        .build())
                .transactionStatus(TransactionResponse.TransactionStatusDto.builder()
                        .name("PENDING")
                        .build())
                .value(new BigDecimal("0.01"))
                .createdAt(LocalDateTime.now())
                .build();

        when(commandBus.dispatch(any(CreateTransactionCommand.class)))
                .thenReturn(minValueResponse);

        // When & Then
        mockMvc.perform(post("/api/v1/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(minValueRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.value").value(0.01));

        verify(commandBus, times(1)).dispatch(any(CreateTransactionCommand.class));
    }

    @Test
    @DisplayName("Should create transaction with large value")
    void shouldCreateTransactionWithLargeValue() throws Exception {
        // Given
        CreateTransactionRequest largeValueRequest = CreateTransactionRequest.builder()
                .accountExternalIdDebit(debitAccountId)
                .accountExternalIdCredit(creditAccountId)
                .tranferTypeId(1)
                .value(new BigDecimal("99999.99"))
                .build();

        TransactionResponse largeValueResponse = TransactionResponse.builder()
                .transactionExternalId(transactionId)
                .transactionType(TransactionResponse.TransactionTypeDto.builder()
                        .name("Tipo A")
                        .build())
                .transactionStatus(TransactionResponse.TransactionStatusDto.builder()
                        .name("PENDING")
                        .build())
                .value(new BigDecimal("99999.99"))
                .createdAt(LocalDateTime.now())
                .build();

        when(commandBus.dispatch(any(CreateTransactionCommand.class)))
                .thenReturn(largeValueResponse);

        // When & Then
        mockMvc.perform(post("/api/v1/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(largeValueRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.value").value(99999.99));

        verify(commandBus, times(1)).dispatch(any(CreateTransactionCommand.class));
    }
}
