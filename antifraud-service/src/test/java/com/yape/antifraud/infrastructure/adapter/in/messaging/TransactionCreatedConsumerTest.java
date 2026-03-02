package com.yape.antifraud.infrastructure.adapter.in.messaging;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.yape.antifraud.domain.model.ValidationResult;
import com.yape.antifraud.domain.model.ValidationStatus;
import com.yape.antifraud.domain.port.in.ValidateTransactionUseCase;
import com.yape.antifraud.domain.port.out.ValidationResultPublisher;
import com.yape.antifraud.infrastructure.adapter.out.cache.IdempotencyService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Transaction Created Consumer Tests")
class TransactionCreatedConsumerTest {

    @Mock
    private ValidateTransactionUseCase validateUseCase;

    @Mock
    private ValidationResultPublisher resultPublisher;

    @Mock
    private IdempotencyService idempotencyService;

    private TransactionCreatedConsumer consumer;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        consumer = new TransactionCreatedConsumer(validateUseCase, resultPublisher, idempotencyService);
        consumer.init();
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }

    @Test
    @DisplayName("Should process transaction and publish approved result")
    void shouldProcessTransactionAndPublishApprovedResult() throws Exception {
        UUID transactionId = UUID.randomUUID();
        TransactionCreatedEvent event = createEvent(transactionId, new BigDecimal("500.00"));
        String message = objectMapper.writeValueAsString(event);

        when(idempotencyService.tryAcquireLock(any())).thenReturn(true);
        when(validateUseCase.validate(any())).thenReturn(ValidationResult.approved(transactionId));

        consumer.consume(message);

        verify(idempotencyService).tryAcquireLock("validate:" + transactionId);
        verify(validateUseCase).validate(any());
        verify(resultPublisher).publishValidationResult(any());
    }

    @Test
    @DisplayName("Should skip duplicate event")
    void shouldSkipDuplicateEvent() throws Exception {
        UUID transactionId = UUID.randomUUID();
        TransactionCreatedEvent event = createEvent(transactionId, new BigDecimal("500.00"));
        String message = objectMapper.writeValueAsString(event);

        when(idempotencyService.tryAcquireLock(any())).thenReturn(false); // Lock not acquired = duplicate

        consumer.consume(message);

        verify(idempotencyService).tryAcquireLock(any());
        verify(validateUseCase, never()).validate(any());
        verify(resultPublisher, never()).publishValidationResult(any());
    }

    @Test
    @DisplayName("Should process transaction and publish rejected result")
    void shouldProcessTransactionAndPublishRejectedResult() throws Exception {
        UUID transactionId = UUID.randomUUID();
        TransactionCreatedEvent event = createEvent(transactionId, new BigDecimal("1500.00"));
        String message = objectMapper.writeValueAsString(event);

        when(idempotencyService.tryAcquireLock(any())).thenReturn(true);
        when(validateUseCase.validate(any())).thenReturn(
            ValidationResult.rejected(transactionId, "Value exceeds maximum"));

        consumer.consume(message);

        ArgumentCaptor<ValidationResult> captor = ArgumentCaptor.forClass(ValidationResult.class);
        verify(resultPublisher).publishValidationResult(captor.capture());

        ValidationResult result = captor.getValue();
        assertEquals(ValidationStatus.REJECTED, result.getStatus());
        assertEquals(transactionId, result.getTransactionExternalId());
    }

    private TransactionCreatedEvent createEvent(UUID transactionId, BigDecimal value) {
        TransactionCreatedEvent event = new TransactionCreatedEvent();
        event.setTransactionExternalId(transactionId);
        event.setAccountExternalIdDebit(UUID.randomUUID());
        event.setAccountExternalIdCredit(UUID.randomUUID());
        event.setTransferTypeId(1);
        event.setValue(value);
        event.setStatus("pending");
        event.setCreatedAt(LocalDateTime.now());
        return event;
    }
}