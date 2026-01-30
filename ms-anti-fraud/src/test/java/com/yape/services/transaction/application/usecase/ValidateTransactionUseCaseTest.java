package com.yape.services.transaction.application.usecase;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import com.yape.services.common.events.EventMetadata;
import com.yape.services.transaction.domain.model.ValidationResult;
import com.yape.services.transaction.domain.service.AntiFraudValidationService;
import com.yape.services.transaction.domain.service.TransactionStatusEventPublisher;
import com.yape.services.transaction.events.TransactionCreatedEvent;
import com.yape.services.transaction.events.TransactionCreatedPayload;
import com.yape.services.transaction.events.TransactionStatusUpdatedEvent;
import com.yape.services.transaction.events.enums.TransactionStatus;
import java.math.BigDecimal;
import java.sql.Timestamp;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

/**
 * Unit tests for {@link ValidateTransactionUseCase}.
 */
@ExtendWith(MockitoExtension.class)
class ValidateTransactionUseCaseTest {

  @Mock
  AntiFraudValidationService antiFraudValidationService;
  @Mock
  TransactionStatusEventPublisher eventPublisher;

  @InjectMocks
  ValidateTransactionUseCase useCase;

  @Test
  @DisplayName("should approve transaction and publish APPROVED event when validation passes")
  void shouldApproveTransactionAndPublishApprovedEventWhenValidationPasses() {
    // Arrange
    String transactionExternalId = "tx-123";
    String value = "100.00";
    TransactionCreatedPayload payload =
        buildTransactionCreatedPayload(transactionExternalId, value);
    EventMetadata metadata = buildMetadata("req-1");
    TransactionCreatedEvent event = TransactionCreatedEvent.newBuilder()
        .setPayload(payload)
        .setMetadata(metadata)
        .build();
    when(antiFraudValidationService.validate(new BigDecimal(value)))
        .thenReturn(ValidationResult.approved());

    // Act
    useCase.execute(event);

    // Assert
    ArgumentCaptor<TransactionStatusUpdatedEvent> captor =
        ArgumentCaptor.forClass(TransactionStatusUpdatedEvent.class);
    verify(eventPublisher).publishStatusUpdated(captor.capture());
    TransactionStatusUpdatedEvent publishedEvent = captor.getValue();
    assertEquals(TransactionStatus.APPROVED, publishedEvent.getPayload().getNewStatus());
    assertTrue(publishedEvent.getPayload().getValidationResult().getIsValid());
    assertNull(publishedEvent.getPayload().getValidationResult().getRuleCode());
    assertEquals(transactionExternalId, publishedEvent.getPayload().getTransactionExternalId());
  }

  @Test
  @DisplayName("should reject transaction and publish REJECTED event when validation fails")
  void shouldRejectTransactionAndPublishRejectedEventWhenValidationFails() {
    // Arrange
    String transactionExternalId = "tx-456";
    String value = "1000.01";
    String ruleCode = "MAX_AMOUNT_EXCEEDED";
    TransactionCreatedPayload payload =
        buildTransactionCreatedPayload(transactionExternalId, value);
    EventMetadata metadata = buildMetadata("req-2");
    TransactionCreatedEvent event = TransactionCreatedEvent.newBuilder()
        .setPayload(payload)
        .setMetadata(metadata)
        .build();
    when(antiFraudValidationService.validate(new BigDecimal(value)))
        .thenReturn(ValidationResult.rejected(ruleCode));

    // Act
    useCase.execute(event);

    // Assert
    ArgumentCaptor<TransactionStatusUpdatedEvent> captor =
        ArgumentCaptor.forClass(TransactionStatusUpdatedEvent.class);
    verify(eventPublisher).publishStatusUpdated(captor.capture());
    TransactionStatusUpdatedEvent publishedEvent = captor.getValue();
    assertEquals(TransactionStatus.REJECTED, publishedEvent.getPayload().getNewStatus());
    assertFalse(publishedEvent.getPayload().getValidationResult().getIsValid());
    assertEquals(ruleCode, publishedEvent.getPayload().getValidationResult().getRuleCode());
    assertEquals(transactionExternalId, publishedEvent.getPayload().getTransactionExternalId());
  }

  @Test
  @DisplayName("should handle null ruleCode in rejected validation result")
  void shouldHandleNullRuleCodeInRejectedValidationResult() {
    // Arrange
    String transactionExternalId = "tx-789";
    String value = "2000.00";
    TransactionCreatedPayload payload =
        buildTransactionCreatedPayload(transactionExternalId, value);
    EventMetadata metadata = buildMetadata("req-3");
    TransactionCreatedEvent event = TransactionCreatedEvent.newBuilder()
        .setPayload(payload)
        .setMetadata(metadata)
        .build();
    when(antiFraudValidationService.validate(new BigDecimal(value)))
        .thenReturn(ValidationResult.rejected(null));

    // Act
    useCase.execute(event);

    // Assert
    ArgumentCaptor<TransactionStatusUpdatedEvent> captor =
        ArgumentCaptor.forClass(TransactionStatusUpdatedEvent.class);
    verify(eventPublisher).publishStatusUpdated(captor.capture());
    TransactionStatusUpdatedEvent publishedEvent = captor.getValue();
    assertEquals(TransactionStatus.REJECTED, publishedEvent.getPayload().getNewStatus());
    assertFalse(publishedEvent.getPayload().getValidationResult().getIsValid());
    assertNull(publishedEvent.getPayload().getValidationResult().getRuleCode());
  }

  @Test
  @DisplayName("should use requestId from original event metadata in published event")
  void shouldUseRequestIdFromOriginalEventMetadataInPublishedEvent() {
    // Arrange
    String transactionExternalId = "tx-reqid";
    String value = "50.00";
    String requestId = "req-xyz";
    TransactionCreatedPayload payload =
        buildTransactionCreatedPayload(transactionExternalId, value);
    EventMetadata metadata = buildMetadata(requestId);
    TransactionCreatedEvent event = TransactionCreatedEvent.newBuilder()
        .setPayload(payload)
        .setMetadata(metadata)
        .build();
    when(antiFraudValidationService.validate(new BigDecimal(value)))
        .thenReturn(ValidationResult.approved());

    // Act
    useCase.execute(event);

    // Assert
    ArgumentCaptor<TransactionStatusUpdatedEvent> captor =
        ArgumentCaptor.forClass(TransactionStatusUpdatedEvent.class);
    verify(eventPublisher).publishStatusUpdated(captor.capture());
    TransactionStatusUpdatedEvent publishedEvent = captor.getValue();
    assertEquals(requestId, publishedEvent.getMetadata().getRequestId());
  }

  @Test
  @DisplayName("should throw NumberFormatException if payload value is not a valid number")
  void shouldThrowNumberFormatExceptionIfPayloadValueIsNotValidNumber() {
    // Arrange
    String transactionExternalId = "tx-invalid";
    String value = "not-a-number";
    TransactionCreatedPayload payload =
        buildTransactionCreatedPayload(transactionExternalId, value);
    EventMetadata metadata = buildMetadata("req-invalid");
    TransactionCreatedEvent event = TransactionCreatedEvent.newBuilder()
        .setPayload(payload)
        .setMetadata(metadata)
        .build();

    // Act & Assert
    assertThrows(NumberFormatException.class, () -> useCase.execute(event));
    verifyNoInteractions(eventPublisher);
  }

  EventMetadata buildMetadata(String requestId) {
    return EventMetadata.newBuilder()
        .setEventId("event-123")
        .setEventType("TransactionCreated")
        .setEventTimestamp(new Timestamp(System.currentTimeMillis()).toString())
        .setSource("ms-transaction")
        .setVersion("1.0")
        .setRequestId(requestId)
        .build();
  }

  TransactionCreatedPayload buildTransactionCreatedPayload(
      String transactionExternalId,
      String value
  ) {
    return TransactionCreatedPayload.newBuilder()
        .setTransactionExternalId(transactionExternalId)
        .setAccountExternalIdDebit("debit-acc-1")
        .setAccountExternalIdCredit("credit-acc-1")
        .setTransferTypeId(1)
        .setValue(value)
        .setStatus(com.yape.services.transaction.events.enums.TransactionStatus.PENDING)
        .setCreatedAt(new Timestamp(System.currentTimeMillis()).toString())
        .build();
  }
}
