package com.yape.services.transaction.application.query;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.yape.services.transaction.domain.model.TransactionStatus;
import com.yape.services.transaction.domain.repository.TransactionStatusRepository;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class TransactionStatusQueryHandlerTest {

  @Mock
  private TransactionStatusRepository transactionStatusRepository;

  private TransactionStatusQueryHandler handler;

  @BeforeEach
  void setUp() {
    handler = new TransactionStatusQueryHandler(transactionStatusRepository);
  }

  @Test
  @DisplayName("should return status when found by code")
  void shouldReturnStatusWhenFoundByCode() {
    // Arrange
    String code = "PENDING";
    TransactionStatus expectedStatus = createStatus(1, code, "Pending");
    when(transactionStatusRepository.findByCode(code))
        .thenReturn(Optional.of(expectedStatus));

    // Act
    Optional<TransactionStatus> result = handler.getTransactionStatusByCode(code);

    // Assert
    assertTrue(result.isPresent());
    assertEquals(code, result.get().getCode());
    verify(transactionStatusRepository).findByCode(code);
  }

  @Test
  @DisplayName("should return empty when status not found by code")
  void shouldReturnEmptyWhenStatusNotFoundByCode() {
    // Arrange
    String code = "UNKNOWN";
    when(transactionStatusRepository.findByCode(code))
        .thenReturn(Optional.empty());

    // Act
    Optional<TransactionStatus> result = handler.getTransactionStatusByCode(code);

    // Assert
    assertFalse(result.isPresent());
    verify(transactionStatusRepository).findByCode(code);
  }

  @Test
  @DisplayName("should find APPROVED status")
  void shouldFindApprovedStatus() {
    // Arrange
    String code = "APPROVED";
    TransactionStatus expectedStatus = createStatus(2, code, "Approved");
    when(transactionStatusRepository.findByCode(code))
        .thenReturn(Optional.of(expectedStatus));

    // Act
    Optional<TransactionStatus> result = handler.getTransactionStatusByCode(code);

    // Assert
    assertTrue(result.isPresent());
    assertEquals("APPROVED", result.get().getCode());
  }

  @Test
  @DisplayName("should find REJECTED status")
  void shouldFindRejectedStatus() {
    // Arrange
    String code = "REJECTED";
    TransactionStatus expectedStatus = createStatus(3, code, "Rejected");
    when(transactionStatusRepository.findByCode(code))
        .thenReturn(Optional.of(expectedStatus));

    // Act
    Optional<TransactionStatus> result = handler.getTransactionStatusByCode(code);

    // Assert
    assertTrue(result.isPresent());
    assertEquals("REJECTED", result.get().getCode());
  }

  @Test
  @DisplayName("should return status when found by ID")
  void shouldReturnStatusWhenFoundById() {
    // Arrange
    Integer id = 1;
    TransactionStatus expectedStatus = createStatus(id, "PENDING", "Pending");
    when(transactionStatusRepository.findById(id))
        .thenReturn(Optional.of(expectedStatus));

    // Act
    Optional<TransactionStatus> result = handler.getTransactionStatusById(id);

    // Assert
    assertTrue(result.isPresent());
    assertEquals(id, result.get().getTransactionStatusId());
    verify(transactionStatusRepository).findById(id);
  }

  @Test
  @DisplayName("should return empty when status not found by ID")
  void shouldReturnEmptyWhenStatusNotFoundById() {
    // Arrange
    Integer id = 999;
    when(transactionStatusRepository.findById(id))
        .thenReturn(Optional.empty());

    // Act
    Optional<TransactionStatus> result = handler.getTransactionStatusById(id);

    // Assert
    assertFalse(result.isPresent());
    verify(transactionStatusRepository).findById(id);
  }

  private TransactionStatus createStatus(int id, String code, String name) {
    return TransactionStatus.builder()
        .transactionStatusId(id)
        .code(code)
        .name(name)
        .build();
  }
}
