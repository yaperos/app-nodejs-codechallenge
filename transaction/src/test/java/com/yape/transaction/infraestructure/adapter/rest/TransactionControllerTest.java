package com.yape.transaction.infraestructure.adapter.rest;

import com.yape.transaction.application.dto.BaseTransaction;
import com.yape.transaction.application.dto.CreateTransactionRequest;
import com.yape.transaction.application.dto.CreateTransactionResponse;
import com.yape.transaction.application.dto.GetTransactionResponse;
import com.yape.transaction.application.usecase.CreateTransactionUseCase;
import com.yape.transaction.application.usecase.GetTransactionUseCase;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionControllerTest {

    @Mock
    private CreateTransactionUseCase createTransactionUseCase;

    @Mock
    private GetTransactionUseCase getTransactionUseCase;

    @InjectMocks
    private TransactionController transactionController;

    private CreateTransactionRequest createRequest;
    private CreateTransactionResponse createResponse;
    private GetTransactionResponse getResponse;
    private String transactionExternalId;

    @BeforeEach
    void setUp() {
        transactionExternalId = UUID.randomUUID().toString();

        createRequest = new CreateTransactionRequest();
        createRequest.setAccountExternalIdDebit(UUID.randomUUID().toString());
        createRequest.setAccountExternalIdCredit(UUID.randomUUID().toString());
        createRequest.setTranferTypeId(1);
        createRequest.setValue(new BigDecimal("500.00"));

        createResponse = CreateTransactionResponse.builder()
                .transactionExternalId(transactionExternalId)
                .build();

        getResponse = GetTransactionResponse.builder()
                .transactionExternalId(transactionExternalId)
                .transactionType(new BaseTransaction("DEPOSIT"))
                .transactionStatus(new BaseTransaction("PENDING"))
                .value(new BigDecimal("500.00"))
                .createdAt(LocalDateTime.now())
                .build();
    }


    @Test
    @DisplayName("createTransaction - should return transactionExternalId when created successfully")
    void createTransaction_shouldReturnResponse_whenCreatedSuccessfully() {
        when(createTransactionUseCase.execute(any(CreateTransactionRequest.class)))
                .thenReturn(Mono.just(createResponse));

        StepVerifier.create(transactionController.createTransaction(createRequest))
                .assertNext(response -> {
                    assertThat(response).isNotNull();
                    assertThat(response.getTransactionExternalId()).isEqualTo(transactionExternalId);
                })
                .verifyComplete();

        verify(createTransactionUseCase, times(1)).execute(createRequest);
    }

    @Test
    @DisplayName("createTransaction - should propagate error when use case fails")
    void createTransaction_shouldPropagateError_whenUseCaseFails() {
        when(createTransactionUseCase.execute(any(CreateTransactionRequest.class)))
                .thenReturn(Mono.error(new RuntimeException("Unexpected error")));

        StepVerifier.create(transactionController.createTransaction(createRequest))
                .expectErrorMatches(ex ->
                        ex instanceof RuntimeException &&
                        ex.getMessage().equals("Unexpected error"))
                .verify();

        verify(createTransactionUseCase, times(1)).execute(createRequest);
    }

    @Test
    @DisplayName("createTransaction - should propagate 400 when transaction type is invalid")
    void createTransaction_shouldPropagate400_whenTransactionTypeIsInvalid() {
        when(createTransactionUseCase.execute(any(CreateTransactionRequest.class)))
                .thenReturn(Mono.error(new ResponseStatusException(
                        org.springframework.http.HttpStatus.BAD_REQUEST, "Invalid transaction type")));

        StepVerifier.create(transactionController.createTransaction(createRequest))
                .expectErrorMatches(ex ->
                        ex instanceof ResponseStatusException &&
                        ((ResponseStatusException) ex).getStatusCode().value() == 400)
                .verify();

        verify(createTransactionUseCase, times(1)).execute(createRequest);
    }


    @Test
    @DisplayName("getTransaction - should return transaction when it exists")
    void getTransaction_shouldReturnTransaction_whenExists() {
        when(getTransactionUseCase.execute(transactionExternalId))
                .thenReturn(Mono.just(getResponse));

        StepVerifier.create(transactionController.getTransaction(transactionExternalId))
                .assertNext(response -> {
                    assertThat(response).isNotNull();
                    assertThat(response.getTransactionExternalId()).isEqualTo(transactionExternalId);
                    assertThat(response.getTransactionType().getName()).isEqualTo("DEPOSIT");
                    assertThat(response.getTransactionStatus().getName()).isEqualTo("PENDING");
                    assertThat(response.getValue()).isEqualTo(new BigDecimal("500.00"));
                })
                .verifyComplete();

        verify(getTransactionUseCase, times(1)).execute(transactionExternalId);
    }

    @Test
    @DisplayName("getTransaction - should propagate 404 when transaction does not exist")
    void getTransaction_shouldPropagate404_whenTransactionDoesNotExist() {
        when(getTransactionUseCase.execute(transactionExternalId))
                .thenReturn(Mono.error(new ResponseStatusException(
                        org.springframework.http.HttpStatus.NOT_FOUND,
                        "Transaction with ID: " + transactionExternalId + " not found")));

        StepVerifier.create(transactionController.getTransaction(transactionExternalId))
                .expectErrorMatches(ex ->
                        ex instanceof ResponseStatusException &&
                        ((ResponseStatusException) ex).getStatusCode().value() == 404 &&
                        ex.getMessage().contains(transactionExternalId))
                .verify();

        verify(getTransactionUseCase, times(1)).execute(transactionExternalId);
    }

    @Test
    @DisplayName("getTransaction - should propagate error when use case fails")
    void getTransaction_shouldPropagateError_whenUseCaseFails() {
        when(getTransactionUseCase.execute(transactionExternalId))
                .thenReturn(Mono.error(new RuntimeException("DB connection error")));

        StepVerifier.create(transactionController.getTransaction(transactionExternalId))
                .expectErrorMatches(ex ->
                        ex instanceof RuntimeException &&
                        ex.getMessage().equals("DB connection error"))
                .verify();

        verify(getTransactionUseCase, times(1)).execute(transactionExternalId);
    }
}

