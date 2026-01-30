package com.yape.services.transaction.application.usecase;

import com.yape.services.common.events.EventMetadata;
import com.yape.services.common.util.Constants;
import com.yape.services.transaction.domain.service.AntiFraudValidationService;
import com.yape.services.transaction.domain.service.TransactionStatusEventPublisher;
import com.yape.services.transaction.events.TransactionCreatedEvent;
import com.yape.services.transaction.events.TransactionCreatedPayload;
import com.yape.services.transaction.events.TransactionStatusUpdatedEvent;
import com.yape.services.transaction.events.TransactionStatusUpdatedPayload;
import com.yape.services.transaction.events.ValidationResult;
import com.yape.services.transaction.events.enums.TransactionStatus;
import jakarta.enterprise.context.ApplicationScoped;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.UUID;
import org.jboss.logging.Logger;

/**
 * Use case for validating a transaction against anti-fraud rules.
 * Receives a TransactionCreatedEvent, validates it, and publishes
 * a TransactionStatusUpdatedEvent with the result.
 */
@ApplicationScoped
public class ValidateTransactionUseCase {

  private static final Logger LOGGER = Logger.getLogger(ValidateTransactionUseCase.class);
  private static final DateTimeFormatter ISO_FORMATTER = DateTimeFormatter
      .ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSSZ")
      .withZone(ZoneOffset.UTC);

  private final AntiFraudValidationService antiFraudValidationService;
  private final TransactionStatusEventPublisher eventPublisher;

  /**
   * Constructor for ValidateTransactionUseCase.
   *
   * @param antiFraudValidationService the service for validating transactions
   * @param eventPublisher             the publisher for transaction status events
   */
  public ValidateTransactionUseCase(AntiFraudValidationService antiFraudValidationService,
                                    TransactionStatusEventPublisher eventPublisher) {
    this.antiFraudValidationService = antiFraudValidationService;
    this.eventPublisher = eventPublisher;
  }

  /**
   * Executes the anti-fraud validation for a transaction.
   *
   * @param event the transaction created event to validate
   */
  public void execute(TransactionCreatedEvent event) {
    TransactionCreatedPayload payload = event.getPayload();
    String transactionExternalId = payload.getTransactionExternalId();

    LOGGER.infof("Processing transaction for anti-fraud validation: %s", transactionExternalId);

    BigDecimal transactionValue = new BigDecimal(payload.getValue());
    com.yape.services.transaction.domain.model.ValidationResult result =
        antiFraudValidationService.validate(transactionValue);

    TransactionStatus newStatus = result.isValid()
        ? TransactionStatus.APPROVED
        : TransactionStatus.REJECTED;

    TransactionStatusUpdatedEvent statusUpdatedEvent = buildStatusUpdatedEvent(
        event,
        payload,
        result,
        newStatus
    );

    eventPublisher.publishStatusUpdated(statusUpdatedEvent);

    LOGGER.infof("Transaction %s validation completed with status: %s",
        transactionExternalId, newStatus);
  }

  private TransactionStatusUpdatedEvent buildStatusUpdatedEvent(
      TransactionCreatedEvent originalEvent,
      TransactionCreatedPayload payload,
      com.yape.services.transaction.domain.model.ValidationResult result,
      TransactionStatus newStatus) {

    String requestId = originalEvent.getMetadata().getRequestId();

    EventMetadata metadata = EventMetadata.newBuilder()
        .setEventId(UUID.randomUUID().toString())
        .setEventType(Constants.EVENT_TYPE_TRANSACTION_STATUS_UPDATED)
        .setEventTimestamp(ISO_FORMATTER.format(Instant.now()))
        .setSource(Constants.EVENT_SOURCE)
        .setVersion(Constants.SCHEMA_VERSION)
        .setRequestId(requestId)
        .build();

    ValidationResult validationResult = ValidationResult.newBuilder()
        .setIsValid(result.isValid())
        .setRuleCode(result.getRuleCode())
        .build();

    TransactionStatusUpdatedPayload statusPayload = TransactionStatusUpdatedPayload.newBuilder()
        .setTransactionExternalId(payload.getTransactionExternalId())
        .setPreviousStatus(TransactionStatus.PENDING)
        .setNewStatus(newStatus)
        .setValue(payload.getValue())
        .setValidationResult(validationResult)
        .setProcessedAt(ISO_FORMATTER.format(Instant.now()))
        .build();

    return TransactionStatusUpdatedEvent.newBuilder()
        .setMetadata(metadata)
        .setPayload(statusPayload)
        .build();
  }

}
