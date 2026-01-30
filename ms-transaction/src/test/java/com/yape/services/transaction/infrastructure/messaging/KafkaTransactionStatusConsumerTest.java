package com.yape.services.transaction.infrastructure.messaging;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;

import com.yape.services.common.events.EventMetadata;
import com.yape.services.transaction.application.usecase.UpdateTransactionStatusUseCase;
import com.yape.services.transaction.events.TransactionStatusUpdatedEvent;
import com.yape.services.transaction.events.TransactionStatusUpdatedPayload;
import com.yape.services.transaction.events.ValidationResult;
import com.yape.services.transaction.events.enums.TransactionStatus;
import io.smallrye.reactive.messaging.kafka.Record;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class KafkaTransactionStatusConsumerTest {

  @Mock
  private UpdateTransactionStatusUseCase updateTransactionStatusUseCase;

  private KafkaTransactionStatusConsumer consumer;

  private static final UUID TRANSACTION_EXTERNAL_ID = UUID.randomUUID();
  private static final String MESSAGE_KEY = TRANSACTION_EXTERNAL_ID.toString();

  @BeforeEach
  void setUp() {
    consumer = new KafkaTransactionStatusConsumer(updateTransactionStatusUseCase);
  }

  @Test
  @DisplayName("should delegate to use case with event from record")
  void shouldDelegateToUseCaseWithEventFromRecord() {
    // Given
    TransactionStatusUpdatedEvent event = createEvent(TransactionStatus.APPROVED);
    Record<String, TransactionStatusUpdatedEvent> eventRecord = Record.of(MESSAGE_KEY, event);

    // When
    consumer.consume(eventRecord);

    // Then
    verify(updateTransactionStatusUseCase).execute(event);
  }

  @Test
  @DisplayName("should handle REJECTED status events")
  void shouldHandleRejectedStatusEvents() {
    // Given
    TransactionStatusUpdatedEvent event = createEvent(TransactionStatus.REJECTED);
    Record<String, TransactionStatusUpdatedEvent> eventRecord = Record.of(MESSAGE_KEY, event);

    // When
    consumer.consume(eventRecord);

    // Then
    verify(updateTransactionStatusUseCase).execute(event);
  }

  @Test
  @DisplayName("should rethrow exception when use case fails")
  void shouldRethrowExceptionWhenUseCaseFails() {
    // Given
    TransactionStatusUpdatedEvent event = createEvent(TransactionStatus.APPROVED);
    Record<String, TransactionStatusUpdatedEvent> eventRecord = Record.of(MESSAGE_KEY, event);
    RuntimeException expectedException = new RuntimeException("Database error");

    doThrow(expectedException).when(updateTransactionStatusUseCase).execute(event);

    // When/Then
    RuntimeException exception =
        assertThrows(RuntimeException.class, () -> consumer.consume(eventRecord));
    assertEquals("Database error", exception.getMessage());
  }

  @Test
  @DisplayName("should process event with null request ID in metadata")
  void shouldProcessEventWithNullRequestId() {
    // Given
    TransactionStatusUpdatedEvent event = createEventWithNullRequestId();
    Record<String, TransactionStatusUpdatedEvent> eventRecord = Record.of(MESSAGE_KEY, event);

    // When
    consumer.consume(eventRecord);

    // Then
    verify(updateTransactionStatusUseCase).execute(event);
  }

  private TransactionStatusUpdatedEvent createEvent(TransactionStatus newStatus) {
    EventMetadata metadata = EventMetadata.newBuilder()
        .setEventId(UUID.randomUUID().toString())
        .setEventType("TRANSACTION_STATUS_UPDATED")
        .setEventTimestamp("2024-01-01T00:00:00.000+0000")
        .setSource("ms-anti-fraud")
        .setVersion("1.0.0")
        .setRequestId("request-123")
        .build();

    ValidationResult validationResult = ValidationResult.newBuilder()
        .setIsValid(newStatus == TransactionStatus.APPROVED)
        .setRuleCode(newStatus == TransactionStatus.REJECTED ? "MAX_AMOUNT_EXCEEDED" : null)
        .build();

    TransactionStatusUpdatedPayload payload = TransactionStatusUpdatedPayload.newBuilder()
        .setTransactionExternalId(TRANSACTION_EXTERNAL_ID.toString())
        .setPreviousStatus(TransactionStatus.PENDING)
        .setNewStatus(newStatus)
        .setValue("100.00")
        .setValidationResult(validationResult)
        .setProcessedAt("2024-01-01T00:00:00.000+0000")
        .build();

    return TransactionStatusUpdatedEvent.newBuilder()
        .setMetadata(metadata)
        .setPayload(payload)
        .build();
  }

  private TransactionStatusUpdatedEvent createEventWithNullRequestId() {
    EventMetadata metadata = EventMetadata.newBuilder()
        .setEventId(UUID.randomUUID().toString())
        .setEventType("TRANSACTION_STATUS_UPDATED")
        .setEventTimestamp("2024-01-01T00:00:00.000+0000")
        .setSource("ms-anti-fraud")
        .setVersion("1.0.0")
        .setRequestId(null)
        .build();

    ValidationResult validationResult = ValidationResult.newBuilder()
        .setIsValid(true)
        .setRuleCode(null)
        .build();

    TransactionStatusUpdatedPayload payload = TransactionStatusUpdatedPayload.newBuilder()
        .setTransactionExternalId(TRANSACTION_EXTERNAL_ID.toString())
        .setPreviousStatus(TransactionStatus.PENDING)
        .setNewStatus(TransactionStatus.APPROVED)
        .setValue("100.00")
        .setValidationResult(validationResult)
        .setProcessedAt("2024-01-01T00:00:00.000+0000")
        .build();

    return TransactionStatusUpdatedEvent.newBuilder()
        .setMetadata(metadata)
        .setPayload(payload)
        .build();
  }
}
