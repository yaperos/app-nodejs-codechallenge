package com.yape.transaction.application.service;

import com.yape.transaction.application.dto.CreateTransactionRequest;
import com.yape.transaction.application.dto.CreateTransactionResponse;
import com.yape.transaction.domain.entities.Transaction;
import com.yape.transaction.domain.enums.TransactionStatus;
import com.yape.transaction.domain.model.EventOutbound;
import com.yape.transaction.domain.ports.KafkaProducerPort;
import com.yape.transaction.domain.ports.TransactionRepositoryPort;
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
class CreateTransactionServiceTest {

    @Mock
    private TransactionRepositoryPort transactionRepositoryPort;

    @Mock
    private KafkaProducerPort kafkaProducerPort;

    @InjectMocks
    private CreateTransactionService createTransactionService;

    private CreateTransactionRequest request;
    private Transaction savedTransaction;

    @BeforeEach
    void setUp() {
        request = new CreateTransactionRequest();
        request.setAccountExternalIdDebit(UUID.randomUUID().toString());
        request.setAccountExternalIdCredit(UUID.randomUUID().toString());
        request.setValue(new BigDecimal("500.00"));

        savedTransaction = Transaction.builder()
                .id(1L)
                .transactionExternalId(UUID.randomUUID().toString())
                .accountExternalIdDebit(request.getAccountExternalIdDebit())
                .accountExternalIdCredit(request.getAccountExternalIdCredit())
                .type("DEPOSIT")
                .status(TransactionStatus.PENDING.getValue())
                .value(request.getValue())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .version(0L)
                .build();
    }

    @Test
    @DisplayName("should create transaction and send kafka event when type is DEPOSIT")
    void execute_shouldCreateTransactionAndSendEvent_whenTypeIsDeposit() {
        request.setTranferTypeId(1);

        when(transactionRepositoryPort.save(any(Transaction.class))).thenReturn(Mono.just(savedTransaction));
        when(kafkaProducerPort.sendValidate(any(EventOutbound.class))).thenReturn(Mono.empty());

        StepVerifier.create(createTransactionService.execute(request))
                .assertNext(response -> {
                    assertThat(response).isNotNull();
                    assertThat(response.getTransactionExternalId())
                            .isEqualTo(savedTransaction.getTransactionExternalId());
                })
                .verifyComplete();

        verify(transactionRepositoryPort, times(1)).save(any(Transaction.class));
        verify(kafkaProducerPort, times(1)).sendValidate(any(EventOutbound.class));
    }

    @Test
    @DisplayName("should create transaction and send kafka event when type is WITHDRAWAL")
    void execute_shouldCreateTransactionAndSendEvent_whenTypeIsWithdrawal() {
        request.setTranferTypeId(2);
        savedTransaction.setType("WITHDRAWAL");

        when(transactionRepositoryPort.save(any(Transaction.class))).thenReturn(Mono.just(savedTransaction));
        when(kafkaProducerPort.sendValidate(any(EventOutbound.class))).thenReturn(Mono.empty());

        StepVerifier.create(createTransactionService.execute(request))
                .assertNext(response -> assertThat(response.getTransactionExternalId())
                        .isEqualTo(savedTransaction.getTransactionExternalId()))
                .verifyComplete();

        verify(transactionRepositoryPort, times(1)).save(any(Transaction.class));
        verify(kafkaProducerPort, times(1)).sendValidate(any(EventOutbound.class));
    }

    @Test
    @DisplayName("should throw BAD_REQUEST when tranferTypeId is invalid")
    void execute_shouldThrowBadRequest_whenTransactionTypeIsInvalid() {
        request.setTranferTypeId(99);

        StepVerifier.create(createTransactionService.execute(request))
                .expectErrorMatches(ex ->
                        ex instanceof ResponseStatusException &&
                        ((ResponseStatusException) ex).getStatusCode().value() == 400 &&
                        ex.getMessage().contains("99"))
                .verify();

        verifyNoInteractions(transactionRepositoryPort);
        verifyNoInteractions(kafkaProducerPort);
    }

    @Test
    @DisplayName("should propagate error when repository save fails")
    void execute_shouldPropagateError_whenRepositorySaveFails() {
        request.setTranferTypeId(1);

        when(transactionRepositoryPort.save(any(Transaction.class)))
                .thenReturn(Mono.error(new RuntimeException("DB connection error")));

        StepVerifier.create(createTransactionService.execute(request))
                .expectErrorMatches(ex ->
                        ex instanceof RuntimeException &&
                        ex.getMessage().equals("DB connection error"))
                .verify();

        verify(transactionRepositoryPort, times(1)).save(any(Transaction.class));
        verifyNoInteractions(kafkaProducerPort);
    }

    @Test
    @DisplayName("should propagate error when kafka producer fails")
    void execute_shouldPropagateError_whenKafkaProducerFails() {
        request.setTranferTypeId(1);

        when(transactionRepositoryPort.save(any(Transaction.class))).thenReturn(Mono.just(savedTransaction));
        when(kafkaProducerPort.sendValidate(any(EventOutbound.class)))
                .thenReturn(Mono.error(new RuntimeException("Kafka unavailable")));

        StepVerifier.create(createTransactionService.execute(request))
                .expectErrorMatches(ex ->
                        ex instanceof RuntimeException &&
                        ex.getMessage().equals("Kafka unavailable"))
                .verify();

        verify(transactionRepositoryPort, times(1)).save(any(Transaction.class));
        verify(kafkaProducerPort, times(1)).sendValidate(any(EventOutbound.class));
    }
}

