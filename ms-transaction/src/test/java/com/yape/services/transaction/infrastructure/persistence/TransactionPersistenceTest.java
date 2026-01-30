package com.yape.services.transaction.infrastructure.persistence;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.yape.services.transaction.domain.model.Transaction;
import com.yape.services.transaction.infrastructure.persistence.entity.TransactionEntity;
import com.yape.services.transaction.infrastructure.persistence.repository.TransactionPostgresRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class TransactionPersistenceTest {

  @Mock
  private TransactionPostgresRepository repository;

  @Captor
  private ArgumentCaptor<TransactionEntity> entityCaptor;

  private TransactionPersistence persistence;

  private static final UUID TRANSACTION_EXTERNAL_ID = UUID.randomUUID();
  private static final UUID DEBIT_ACCOUNT_ID = UUID.randomUUID();
  private static final UUID CREDIT_ACCOUNT_ID = UUID.randomUUID();
  private static final BigDecimal VALUE = new BigDecimal("500.00");

  @BeforeEach
  void setUp() {
    persistence = new TransactionPersistence(repository);
  }

  @Test
  @DisplayName("should convert domain to entity and save")
  void shouldConvertDomainToEntityAndSave() {
    // Arrange
    TransactionEntity savedEntity = createEntity();
    when(repository.save(any(TransactionEntity.class))).thenReturn(savedEntity);

    // Act
    Transaction transaction = createDomainTransaction();
    persistence.save(transaction);

    // Assert
    verify(repository).save(entityCaptor.capture());
    TransactionEntity capturedEntity = entityCaptor.getValue();

    assertEquals(TRANSACTION_EXTERNAL_ID, capturedEntity.getTransactionExternalId());
    assertEquals(DEBIT_ACCOUNT_ID, capturedEntity.getAccountExternalIdDebit());
    assertEquals(CREDIT_ACCOUNT_ID, capturedEntity.getAccountExternalIdCredit());
    assertEquals(1, capturedEntity.getTransferTypeId());
    assertEquals(1, capturedEntity.getTransactionStatusId());
    assertEquals(0, capturedEntity.getValue().compareTo(VALUE));
  }

  @Test
  @DisplayName("should return domain object from saved entity")
  void shouldReturnDomainObjectFromSavedEntity() {
    // Arrange
    Transaction transaction = createDomainTransaction();
    TransactionEntity savedEntity = createEntity();
    when(repository.save(any(TransactionEntity.class))).thenReturn(savedEntity);

    // Act
    Transaction result = persistence.save(transaction);

    // Assert
    assertEquals(TRANSACTION_EXTERNAL_ID, result.getTransactionExternalId());
    assertEquals(0, result.getValue().compareTo(VALUE));
  }

  @Test
  @DisplayName("should return transaction when found")
  void shouldReturnTransactionWhenFound() {
    // Arrange
    TransactionEntity entity = createEntity();
    when(repository.findByTransactionExternalId(TRANSACTION_EXTERNAL_ID))
        .thenReturn(entity);

    // Act
    Optional<Transaction> result = persistence.findByExternalId(TRANSACTION_EXTERNAL_ID);

    // Assert
    assertTrue(result.isPresent());
    assertEquals(TRANSACTION_EXTERNAL_ID, result.get().getTransactionExternalId());
    assertEquals(0, result.get().getValue().compareTo(VALUE));
  }

  @Test
  @DisplayName("should return empty when not found")
  void shouldReturnEmptyWhenNotFound() {
    // Arrange
    when(repository.findByTransactionExternalId(TRANSACTION_EXTERNAL_ID))
        .thenReturn(null);

    // Act
    Optional<Transaction> result = persistence.findByExternalId(TRANSACTION_EXTERNAL_ID);

    // Assert
    assertTrue(result.isEmpty());
  }

  @Test
  @DisplayName("should map all entity fields to domain")
  void shouldMapAllEntityFieldsToDomain() {
    // Arrange
    TransactionEntity entity = createEntity();
    entity.setCreatedAt(LocalDateTime.of(2024, 1, 15, 10, 30));
    when(repository.findByTransactionExternalId(TRANSACTION_EXTERNAL_ID))
        .thenReturn(entity);

    // Act
    Optional<Transaction> result = persistence.findByExternalId(TRANSACTION_EXTERNAL_ID);

    // Assert
    assertTrue(result.isPresent());
    Transaction tx = result.get();
    assertEquals(TRANSACTION_EXTERNAL_ID, tx.getTransactionExternalId());
    assertEquals(DEBIT_ACCOUNT_ID, tx.getAccountExternalIdDebit());
    assertEquals(CREDIT_ACCOUNT_ID, tx.getAccountExternalIdCredit());
    assertEquals(1, tx.getTransferTypeId());
    assertEquals(1, tx.getTransactionStatusId());
    assertEquals(0, tx.getValue().compareTo(VALUE));
    assertEquals(LocalDateTime.of(2024, 1, 15, 10, 30), tx.getCreatedAt());
  }

  @Test
  @DisplayName("should delegate to repository and return updated count")
  void shouldDelegateToRepositoryAndReturnUpdatedCount() {
    // Arrange
    when(repository.updateStatusByExternalId(TRANSACTION_EXTERNAL_ID, 2))
        .thenReturn(1);

    // Act
    int result = persistence.updateStatus(TRANSACTION_EXTERNAL_ID, 2);

    // Assert
    assertEquals(1, result);
    verify(repository).updateStatusByExternalId(TRANSACTION_EXTERNAL_ID, 2);
  }

  @Test
  @DisplayName("should return zero when no rows updated")
  void shouldReturnZeroWhenNoRowsUpdated() {
    // Arrange
    when(repository.updateStatusByExternalId(TRANSACTION_EXTERNAL_ID, 2))
        .thenReturn(0);

    // Act
    int result = persistence.updateStatus(TRANSACTION_EXTERNAL_ID, 2);

    // Assert
    assertEquals(0, result);
  }

  private Transaction createDomainTransaction() {
    return Transaction.builder()
        .transactionExternalId(TRANSACTION_EXTERNAL_ID)
        .accountExternalIdDebit(DEBIT_ACCOUNT_ID)
        .accountExternalIdCredit(CREDIT_ACCOUNT_ID)
        .transferTypeId(1)
        .transactionStatusId(1)
        .value(VALUE)
        .build();
  }

  private TransactionEntity createEntity() {
    TransactionEntity entity = new TransactionEntity();
    entity.setTransactionExternalId(TRANSACTION_EXTERNAL_ID);
    entity.setAccountExternalIdDebit(DEBIT_ACCOUNT_ID);
    entity.setAccountExternalIdCredit(CREDIT_ACCOUNT_ID);
    entity.setTransferTypeId(1);
    entity.setTransactionStatusId(1);
    entity.setValue(VALUE);
    return entity;
  }
}
