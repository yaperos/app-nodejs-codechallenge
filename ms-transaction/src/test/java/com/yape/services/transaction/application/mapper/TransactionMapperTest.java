package com.yape.services.transaction.application.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

import com.yape.services.transaction.application.dto.RequestMetaData;
import com.yape.services.transaction.domain.model.Transaction;
import com.yape.services.transaction.domain.model.TransactionStatus;
import com.yape.services.transaction.events.TransactionCreatedEvent;
import java.math.BigDecimal;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

@DisplayName("TransactionMapper")
class TransactionMapperTest {

  private TransactionMapper mapper;

  private static final UUID TRANSACTION_EXTERNAL_ID = UUID.randomUUID();
  private static final UUID DEBIT_ACCOUNT_ID = UUID.randomUUID();
  private static final UUID CREDIT_ACCOUNT_ID = UUID.randomUUID();
  private static final BigDecimal VALUE = new BigDecimal("250.75");

  @BeforeEach
  void setUp() {
    mapper = new TransactionMapper();
  }

  @Test
  @DisplayName("should map transaction to event with all fields")
  void shouldMapTransactionToEventWithAllFields() {
    // Arrange
    Transaction transaction = createTransaction();
    TransactionStatus status = createPendingStatus();
    RequestMetaData metaData = new RequestMetaData("Bearer token", "req-123", "2024-01-01");

    // Act
    TransactionCreatedEvent event = mapper
        .toTransactionCreatedEvent(transaction, status, metaData);

    // Assert
    assertNotNull(event);
    assertNotNull(event.getMetadata());
    assertNotNull(event.getPayload());
    // Verify metadata
    assertNotNull(event.getMetadata().getEventId());
    assertEquals("TRANSACTION_CREATED", event.getMetadata().getEventType());
    assertEquals("ms-transaction", event.getMetadata().getSource());
    assertEquals("1.0.0", event.getMetadata().getVersion());
    assertEquals("req-123", event.getMetadata().getRequestId());
    assertNotNull(event.getMetadata().getEventTimestamp());
    // Verify payload
    assertEquals(
        TRANSACTION_EXTERNAL_ID.toString(),
        event.getPayload().getTransactionExternalId()
    );
    assertEquals(DEBIT_ACCOUNT_ID.toString(), event.getPayload().getAccountExternalIdDebit());
    assertEquals(CREDIT_ACCOUNT_ID.toString(),
        event.getPayload().getAccountExternalIdCredit());
    assertEquals(1, event.getPayload().getTransferTypeId());
    assertEquals("250.75", event.getPayload().getValue());
    assertEquals("PENDING", event.getPayload().getStatus().name());
  }

  @Test
  @DisplayName("should handle null request metadata")
  void shouldHandleNullRequestMetadata() {
    // Arrange
    Transaction transaction = createTransaction();
    TransactionStatus status = createPendingStatus();

    // Act
    TransactionCreatedEvent event = mapper
        .toTransactionCreatedEvent(transaction, status, null);

    // Assert
    assertNotNull(event);
    assertNull(event.getMetadata().getRequestId());
  }

  @Test
  @DisplayName("should map APPROVED status correctly")
  void shouldMapApprovedStatusCorrectly() {
    // Arrange
    Transaction transaction = createTransaction();
    TransactionStatus status = TransactionStatus.builder()
        .transactionStatusId(2)
        .code("APPROVED")
        .name("Approved")
        .build();
    RequestMetaData metaData = new RequestMetaData("Bearer token", "req-123", "2024-01-01");

    // Act
    TransactionCreatedEvent event = mapper
        .toTransactionCreatedEvent(transaction, status, metaData);

    // Assert
    assertEquals("APPROVED", event.getPayload().getStatus().name());
  }

  @Test
  @DisplayName("should map REJECTED status correctly")
  void shouldMapRejectedStatusCorrectly() {
    // Arrange
    Transaction transaction = createTransaction();
    TransactionStatus status = TransactionStatus.builder()
        .transactionStatusId(3)
        .code("REJECTED")
        .name("Rejected")
        .build();
    RequestMetaData metaData = new RequestMetaData("Bearer token", "req-123", "2024-01-01");

    // Act
    TransactionCreatedEvent event = mapper
        .toTransactionCreatedEvent(transaction, status, metaData);

    // Assert
    assertEquals("REJECTED", event.getPayload().getStatus().name());
  }

  @Test
  @DisplayName("should generate unique event ID for each mapping")
  void shouldGenerateUniqueEventIdForEachMapping() {
    // Arrange
    Transaction transaction = createTransaction();
    TransactionStatus status = createPendingStatus();
    RequestMetaData metaData = new RequestMetaData("Bearer token", "req-123", "2024-01-01");

    // Act
    TransactionCreatedEvent event1 = mapper
        .toTransactionCreatedEvent(transaction, status, metaData);
    TransactionCreatedEvent event2 = mapper
        .toTransactionCreatedEvent(transaction, status, metaData);

    // Assert
    assertNotNull(event1.getMetadata().getEventId());
    assertNotNull(event2.getMetadata().getEventId());
    assertNotEquals(event1.getMetadata().getEventId(), event2.getMetadata().getEventId());
  }

  @Test
  @DisplayName("should format value as plain string without scientific notation")
  void shouldFormatValueAsPlainString() {
    // Arrange
    Transaction transaction = Transaction.builder()
        .transactionExternalId(TRANSACTION_EXTERNAL_ID)
        .accountExternalIdDebit(DEBIT_ACCOUNT_ID)
        .accountExternalIdCredit(CREDIT_ACCOUNT_ID)
        .transferTypeId(1)
        .transactionStatusId(1)
        .value(new BigDecimal("1234567.89"))
        .build();
    TransactionStatus status = createPendingStatus();
    RequestMetaData metaData = new RequestMetaData("Bearer token", "req-123", "2024-01-01");

    // Act
    TransactionCreatedEvent event = mapper
        .toTransactionCreatedEvent(transaction, status, metaData);

    // Assert
    assertEquals("1234567.89", event.getPayload().getValue());
  }

  private Transaction createTransaction() {
    return Transaction.builder()
        .transactionExternalId(TRANSACTION_EXTERNAL_ID)
        .accountExternalIdDebit(DEBIT_ACCOUNT_ID)
        .accountExternalIdCredit(CREDIT_ACCOUNT_ID)
        .transferTypeId(1)
        .transactionStatusId(1)
        .value(VALUE)
        .build();
  }

  private TransactionStatus createPendingStatus() {
    return TransactionStatus.builder()
        .transactionStatusId(1)
        .code("PENDING")
        .name("Pending")
        .build();
  }
}
