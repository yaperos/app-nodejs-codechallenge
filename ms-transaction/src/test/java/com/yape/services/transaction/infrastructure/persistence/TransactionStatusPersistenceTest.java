package com.yape.services.transaction.infrastructure.persistence;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.yape.services.transaction.domain.model.TransactionStatus;
import com.yape.services.transaction.infrastructure.persistence.entity.TransactionStatusEntity;
import com.yape.services.transaction.infrastructure.persistence.repository.TransactionStatusPostgresRepository;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class TransactionStatusPersistenceTest {

  @Mock
  private TransactionStatusPostgresRepository repository;

  private TransactionStatusPersistence persistence;

  private static final Integer STATUS_ID = 1;
  private static final String STATUS_CODE = "PENDING";
  private static final String STATUS_NAME = "Pending";

  @BeforeEach
  void setUp() {
    persistence = new TransactionStatusPersistence(repository);
  }

  @Test
  @DisplayName("should return transaction status when found by code")
  void shouldReturnTransactionStatusWhenFoundByCode() {
    // Arrange
    TransactionStatusEntity entity = createEntity();
    when(repository.findByCode(STATUS_CODE)).thenReturn(entity);

    // Act
    Optional<TransactionStatus> result = persistence.findByCode(STATUS_CODE);

    // Assert
    assertTrue(result.isPresent());
    assertEquals(STATUS_ID, result.get().getTransactionStatusId());
    assertEquals(STATUS_CODE, result.get().getCode());
    assertEquals(STATUS_NAME, result.get().getName());
    verify(repository).findByCode(STATUS_CODE);
  }

  @Test
  @DisplayName("should return empty when not found by code")
  void shouldReturnEmptyWhenNotFoundByCode() {
    // Arrange
    when(repository.findByCode(STATUS_CODE)).thenReturn(null);

    // Act
    Optional<TransactionStatus> result = persistence.findByCode(STATUS_CODE);

    // Assert
    assertTrue(result.isEmpty());
    verify(repository).findByCode(STATUS_CODE);
  }

  @Test
  @DisplayName("should handle different status codes")
  void shouldHandleDifferentStatusCodes() {
    // Arrange
    String approvedCode = "APPROVED";
    TransactionStatusEntity entity = new TransactionStatusEntity();
    entity.setTransactionStatusId(2);
    entity.setCode(approvedCode);
    entity.setName("Approved");
    when(repository.findByCode(approvedCode)).thenReturn(entity);

    // Act
    Optional<TransactionStatus> result = persistence.findByCode(approvedCode);

    // Assert
    assertTrue(result.isPresent());
    assertEquals(approvedCode, result.get().getCode());
  }

  @Test
  @DisplayName("should return transaction status when found by ID")
  void shouldReturnTransactionStatusWhenFoundById() {
    // Arrange
    TransactionStatusEntity entity = createEntity();
    when(repository.findById(STATUS_ID)).thenReturn(entity);

    // Act
    Optional<TransactionStatus> result = persistence.findById(STATUS_ID);

    // Assert
    assertTrue(result.isPresent());
    assertEquals(STATUS_ID, result.get().getTransactionStatusId());
    assertEquals(STATUS_CODE, result.get().getCode());
    assertEquals(STATUS_NAME, result.get().getName());
    verify(repository).findById(STATUS_ID);
  }

  @Test
  @DisplayName("should return empty when not found by ID")
  void shouldReturnEmptyWhenNotFoundById() {
    // Arrange
    when(repository.findById(STATUS_ID)).thenReturn(null);

    // Act
    Optional<TransactionStatus> result = persistence.findById(STATUS_ID);

    // Assert
    assertTrue(result.isEmpty());
    verify(repository).findById(STATUS_ID);
  }

  @Test
  @DisplayName("should map all entity fields to domain")
  void shouldMapAllEntityFieldsToDomain() {
    // Arrange
    TransactionStatusEntity entity = createEntity();
    when(repository.findById(STATUS_ID)).thenReturn(entity);

    // Act
    Optional<TransactionStatus> result = persistence.findById(STATUS_ID);

    // Assert
    assertTrue(result.isPresent());
    TransactionStatus status = result.get();
    assertEquals(entity.getTransactionStatusId(), status.getTransactionStatusId());
    assertEquals(entity.getCode(), status.getCode());
    assertEquals(entity.getName(), status.getName());
  }

  private TransactionStatusEntity createEntity() {
    TransactionStatusEntity entity = new TransactionStatusEntity();
    entity.setTransactionStatusId(STATUS_ID);
    entity.setCode(STATUS_CODE);
    entity.setName(STATUS_NAME);
    return entity;
  }
}
