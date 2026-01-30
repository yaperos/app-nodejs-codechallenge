package com.yape.services.transaction.infrastructure.persistence.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.verify;

import com.yape.services.transaction.infrastructure.persistence.entity.TransactionEntity;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class TransactionPostgresRepositoryTest {

  private TransactionPostgresRepository repository;

  private static final UUID TRANSACTION_EXTERNAL_ID = UUID.randomUUID();
  private static final UUID DEBIT_ACCOUNT_ID = UUID.randomUUID();
  private static final UUID CREDIT_ACCOUNT_ID = UUID.randomUUID();
  private static final BigDecimal VALUE = new BigDecimal("1000.00");

  @BeforeEach
  void setUp() {
    repository = spy(new TransactionPostgresRepository());
  }

  @Test
  @DisplayName("should return entity when found by external ID")
  @SuppressWarnings("unchecked")
  void shouldReturnEntityWhenFoundByExternalId() {
    // Arrange
    TransactionEntity entity = createEntity();
    PanacheQuery<TransactionEntity> query = mock(PanacheQuery.class);
    doReturn(query).when(repository)
        .find("transactionExternalId", TRANSACTION_EXTERNAL_ID);
    doReturn(entity).when(query).firstResult();

    // Act
    TransactionEntity result = repository.findByTransactionExternalId(TRANSACTION_EXTERNAL_ID);

    // Assert
    assertNotNull(result);
    assertEquals(TRANSACTION_EXTERNAL_ID, result.getTransactionExternalId());
    verify(repository).find("transactionExternalId", TRANSACTION_EXTERNAL_ID);
  }

  @Test
  @DisplayName("should return null when not found by external ID")
  @SuppressWarnings("unchecked")
  void shouldReturnNullWhenNotFoundByExternalId() {
    // Arrange
    PanacheQuery<TransactionEntity> query = mock(PanacheQuery.class);
    doReturn(query).when(repository)
        .find("transactionExternalId", TRANSACTION_EXTERNAL_ID);
    doReturn(null).when(query).firstResult();

    // Act
    TransactionEntity result = repository.findByTransactionExternalId(TRANSACTION_EXTERNAL_ID);

    // Assert
    assertNull(result);
  }

  @Test
  @DisplayName("should use correct field name for query")
  @SuppressWarnings("unchecked")
  void shouldUseCorrectFieldNameForQuery() {
    // Arrange
    UUID specificId = UUID.randomUUID();
    PanacheQuery<TransactionEntity> query = mock(PanacheQuery.class);
    doReturn(query).when(repository).find("transactionExternalId", specificId);
    doReturn(null).when(query).firstResult();

    // Act
    repository.findByTransactionExternalId(specificId);

    // Assert
    verify(repository).find("transactionExternalId", specificId);
  }

  @Test
  @DisplayName("should persist entity and return it")
  void shouldPersistEntityAndReturnIt() {
    // Arrange
    TransactionEntity entity = createEntity();
    doAnswer(invocation -> null).when(repository).persist(any(TransactionEntity.class));

    // Act
    TransactionEntity result = repository.save(entity);

    // Assert
    assertEquals(entity, result);
    verify(repository).persist(entity);
  }

  @Test
  @DisplayName("should call persist with correct entity")
  void shouldCallPersistWithCorrectEntity() {
    // Arrange
    TransactionEntity entity = createEntity();
    doAnswer(invocation -> null).when(repository).persist(any(TransactionEntity.class));

    // Act
    repository.save(entity);

    // Assert
    verify(repository).persist(entity);
  }

  @Test
  @DisplayName("should preserve all entity fields after save")
  void shouldPreserveAllEntityFieldsAfterSave() {
    // Arrange
    TransactionEntity entity = createEntity();
    entity.setCreatedAt(LocalDateTime.now());
    doAnswer(invocation -> null).when(repository).persist(any(TransactionEntity.class));

    // Act
    TransactionEntity result = repository.save(entity);

    // Assert
    assertEquals(entity.getTransactionExternalId(), result.getTransactionExternalId());
    assertEquals(entity.getAccountExternalIdDebit(), result.getAccountExternalIdDebit());
    assertEquals(entity.getAccountExternalIdCredit(), result.getAccountExternalIdCredit());
    assertEquals(entity.getValue(), result.getValue());
  }

  @Test
  @DisplayName("should update status and return count")
  void shouldUpdateStatusAndReturnCount() {
    // Arrange
    Integer newStatusId = 2;
    doReturn(1).when(repository)
        .update("transactionStatusId = ?1 where transactionExternalId = ?2",
            newStatusId, TRANSACTION_EXTERNAL_ID);

    // Act
    int result = repository.updateStatusByExternalId(TRANSACTION_EXTERNAL_ID, newStatusId);

    // Assert
    assertEquals(1, result);
  }

  @Test
  @DisplayName("should return zero when no rows updated")
  void shouldReturnZeroWhenNoRowsUpdated() {
    // Arrange
    Integer newStatusId = 2;
    UUID nonExistentId = UUID.randomUUID();
    doReturn(0).when(repository)
        .update("transactionStatusId = ?1 where transactionExternalId = ?2",
            newStatusId, nonExistentId);

    // Act
    int result = repository.updateStatusByExternalId(nonExistentId, newStatusId);

    // Assert
    assertEquals(0, result);
  }

  @Test
  @DisplayName("should use correct update query format")
  void shouldUseCorrectUpdateQueryFormat() {
    // Arrange
    Integer newStatusId = 3;
    doReturn(1).when(repository)
        .update("transactionStatusId = ?1 where transactionExternalId = ?2",
            newStatusId, TRANSACTION_EXTERNAL_ID);

    // Act
    repository.updateStatusByExternalId(TRANSACTION_EXTERNAL_ID, newStatusId);

    // Assert
    verify(repository).update("transactionStatusId = ?1 where transactionExternalId = ?2",
        newStatusId, TRANSACTION_EXTERNAL_ID);
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