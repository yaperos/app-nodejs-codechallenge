package com.yape.services.transaction.application.usecase;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.yape.services.common.events.EventMetadata;
import com.yape.services.transaction.domain.model.TransactionStatus;
import com.yape.services.transaction.domain.repository.TransactionRepository;
import com.yape.services.transaction.domain.repository.TransactionStatusRepository;
import com.yape.services.transaction.domain.service.TransactionCacheService;
import com.yape.services.transaction.events.TransactionStatusUpdatedEvent;
import com.yape.services.transaction.events.TransactionStatusUpdatedPayload;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class UpdateTransactionStatusUseCaseTest {

  @Mock
  private TransactionRepository transactionRepository;
  @Mock
  private TransactionStatusRepository transactionStatusRepository;
  @Mock
  private TransactionCacheService transactionCacheService;

  private UpdateTransactionStatusUseCase useCase;

  private static final UUID TRANSACTION_EXTERNAL_ID = UUID.randomUUID();
  private static final int APPROVED_STATUS_ID = 2;

  @BeforeEach
  void setUp() {
    useCase = new UpdateTransactionStatusUseCase(
        transactionRepository,
        transactionStatusRepository,
        transactionCacheService
    );
  }

  @Test
  @DisplayName("should update transaction status in database and cache")
  void shouldUpdateTransactionStatusSuccessfully() {
    // Arrange
    TransactionStatusUpdatedEvent event = createEvent(
        com.yape.services.transaction.events.enums.TransactionStatus.APPROVED
    );
    TransactionStatus approvedStatus = createApprovedStatus();

    when(transactionStatusRepository.findByCode("APPROVED"))
        .thenReturn(Optional.of(approvedStatus));
    when(transactionRepository.updateStatus(TRANSACTION_EXTERNAL_ID, APPROVED_STATUS_ID))
        .thenReturn(1);

    // Act
    useCase.execute(event);

    // Assert
    verify(transactionRepository).updateStatus(TRANSACTION_EXTERNAL_ID, APPROVED_STATUS_ID);
    verify(transactionCacheService).updateTransactionStatus(
        TRANSACTION_EXTERNAL_ID,
        APPROVED_STATUS_ID,
        "APPROVED"
    );
  }

  @Test
  @DisplayName("should update to REJECTED status successfully")
  void shouldUpdateToRejectedStatusSuccessfully() {
    // Arrange
    TransactionStatusUpdatedEvent event = createEvent(
        com.yape.services.transaction.events.enums.TransactionStatus.REJECTED
    );
    TransactionStatus rejectedStatus = TransactionStatus.builder()
        .transactionStatusId(3)
        .code("REJECTED")
        .name("Rejected")
        .build();

    when(transactionStatusRepository.findByCode("REJECTED"))
        .thenReturn(Optional.of(rejectedStatus));
    when(transactionRepository.updateStatus(TRANSACTION_EXTERNAL_ID, 3))
        .thenReturn(1);

    // Act
    useCase.execute(event);

    // Assert
    verify(transactionRepository).updateStatus(TRANSACTION_EXTERNAL_ID, 3);
    verify(transactionCacheService).updateTransactionStatus(
        TRANSACTION_EXTERNAL_ID,
        3,
        "REJECTED"
    );
  }

  @Test
  @DisplayName("should throw IllegalStateException when status not found")
  void shouldThrowWhenStatusNotFound() {
    // Arrange
    TransactionStatusUpdatedEvent event = createEvent(
        com.yape.services.transaction.events.enums.TransactionStatus.APPROVED
    );

    when(transactionStatusRepository.findByCode("APPROVED"))
        .thenReturn(Optional.empty());

    // Act / Assert
    IllegalStateException thrownException = null;
    try {
      useCase.execute(event);
    } catch (IllegalStateException e) {
      thrownException = e;
    }

    assertNotNull(thrownException);
    var expectedMessage = "Transaction status not found: APPROVED";
    assertEquals(expectedMessage, thrownException.getMessage());

    verify(transactionRepository, never())
        .updateStatus(TRANSACTION_EXTERNAL_ID, APPROVED_STATUS_ID);
    verify(transactionCacheService, never()).updateTransactionStatus(
        TRANSACTION_EXTERNAL_ID,
        APPROVED_STATUS_ID,
        "APPROVED"
    );
  }

  @Test
  @DisplayName("should not update cache when no rows updated in database")
  void shouldNotUpdateCacheWhenNoRowsUpdated() {
    // Arrange
    TransactionStatusUpdatedEvent event = createEvent(
        com.yape.services.transaction.events.enums.TransactionStatus.APPROVED
    );
    TransactionStatus approvedStatus = createApprovedStatus();

    when(transactionStatusRepository.findByCode("APPROVED"))
        .thenReturn(Optional.of(approvedStatus));
    when(transactionRepository.updateStatus(TRANSACTION_EXTERNAL_ID, APPROVED_STATUS_ID))
        .thenReturn(0);

    // Act
    useCase.execute(event);

    // Assert
    verify(transactionRepository).updateStatus(TRANSACTION_EXTERNAL_ID, APPROVED_STATUS_ID);
    verify(transactionCacheService, never()).updateTransactionStatus(
        TRANSACTION_EXTERNAL_ID,
        APPROVED_STATUS_ID,
        "APPROVED"
    );
  }

  private TransactionStatusUpdatedEvent createEvent(
      com.yape.services.transaction.events.enums.TransactionStatus newStatus) {
    EventMetadata metadata = EventMetadata.newBuilder()
        .setEventId(UUID.randomUUID().toString())
        .setEventType("TRANSACTION_STATUS_UPDATED")
        .setEventTimestamp("2024-01-01T00:00:00.000+0000")
        .setSource("ms-anti-fraud")
        .setVersion("1.0.0")
        .setRequestId("request-123")
        .build();

    TransactionStatusUpdatedPayload payload = TransactionStatusUpdatedPayload.newBuilder()
        .setTransactionExternalId(TRANSACTION_EXTERNAL_ID.toString())
        .setPreviousStatus(com.yape.services.transaction.events.enums.TransactionStatus.PENDING)
        .setNewStatus(newStatus)
        .setValue("100.00")
        .setValidationResult(
            com.yape.services.transaction.events.ValidationResult.newBuilder()
                .setIsValid(true)
                .setRuleCode(null)
                .build()
        )
        .setProcessedAt("2024-01-01T00:00:00.000+0000")
        .build();

    return TransactionStatusUpdatedEvent.newBuilder()
        .setMetadata(metadata)
        .setPayload(payload)
        .build();
  }

  private TransactionStatus createApprovedStatus() {
    return TransactionStatus.builder()
        .transactionStatusId(APPROVED_STATUS_ID)
        .code("APPROVED")
        .name("Approved")
        .build();
  }
}
