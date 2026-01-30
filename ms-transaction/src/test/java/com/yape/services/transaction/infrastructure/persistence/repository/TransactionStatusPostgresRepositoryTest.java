package com.yape.services.transaction.infrastructure.persistence.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.verify;

import com.yape.services.transaction.infrastructure.persistence.entity.TransactionStatusEntity;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
@DisplayName("TransactionStatusPostgresRepository")
class TransactionStatusPostgresRepositoryTest {

  private TransactionStatusPostgresRepository repository;

  private static final Integer STATUS_ID = 1;
  private static final String STATUS_CODE = "PENDING";
  private static final String STATUS_NAME = "Pending";

  @BeforeEach
  void setUp() {
    repository = spy(new TransactionStatusPostgresRepository());
  }

  @Test
  @DisplayName("should return entity when found by code")
  @SuppressWarnings("unchecked")
  void shouldReturnEntityWhenFoundByCode() {
    // Arrange
    TransactionStatusEntity entity = createEntity();
    PanacheQuery<TransactionStatusEntity> query = mock(PanacheQuery.class);
    doReturn(query).when(repository).find("code", STATUS_CODE);
    doReturn(entity).when(query).firstResult();

    // Act
    TransactionStatusEntity result = repository.findByCode(STATUS_CODE);

    // Assert
    assertEquals(STATUS_ID, result.getTransactionStatusId());
    assertEquals(STATUS_CODE, result.getCode());
    assertEquals(STATUS_NAME, result.getName());
  }

  @Test
  @DisplayName("should return null when not found by code")
  @SuppressWarnings("unchecked")
  void shouldReturnNullWhenNotFoundByCode() {
    // Arrange
    PanacheQuery<TransactionStatusEntity> query = mock(PanacheQuery.class);
    doReturn(query).when(repository).find("code", STATUS_CODE);
    doReturn(null).when(query).firstResult();

    // Act
    TransactionStatusEntity result = repository.findByCode(STATUS_CODE);

    // Assert
    assertEquals(null, result);
  }

  @Test
  @DisplayName("should use correct field name for query")
  @SuppressWarnings("unchecked")
  void shouldUseCorrectFieldNameForQuery() {
    // Arrange
    String specificCode = "APPROVED";
    PanacheQuery<TransactionStatusEntity> query = mock(PanacheQuery.class);
    doReturn(query).when(repository).find("code", specificCode);
    doReturn(null).when(query).firstResult();

    // Act
    repository.findByCode(specificCode);

    // Assert
    verify(repository).find("code", specificCode);
  }

  @Test
  @DisplayName("should handle different status codes")
  @SuppressWarnings("unchecked")
  void shouldHandleDifferentStatusCodes() {
    // Arrange
    TransactionStatusEntity approvedEntity = createEntity(2, "APPROVED", "Approved");
    PanacheQuery<TransactionStatusEntity> query = mock(PanacheQuery.class);
    doReturn(query).when(repository).find("code", "APPROVED");
    doReturn(approvedEntity).when(query).firstResult();

    // Act
    TransactionStatusEntity result = repository.findByCode("APPROVED");

    // Assert
    assertEquals("APPROVED", result.getCode());
    assertEquals("Approved", result.getName());
  }

  @Test
  @DisplayName("should return entity when found by ID")
  @SuppressWarnings("unchecked")
  void shouldReturnEntityWhenFoundById() {
    // Arrange
    TransactionStatusEntity entity = createEntity();
    PanacheQuery<TransactionStatusEntity> query = mock(PanacheQuery.class);
    doReturn(query).when(repository).find("transactionStatusId", STATUS_ID);
    doReturn(entity).when(query).firstResult();

    // Act
    TransactionStatusEntity result = repository.findById(STATUS_ID);

    // Assert
    assertEquals(STATUS_ID, result.getTransactionStatusId());
    assertEquals(STATUS_CODE, result.getCode());
    assertEquals(STATUS_NAME, result.getName());
  }

  @Test
  @DisplayName("should return null when not found by ID")
  @SuppressWarnings("unchecked")
  void shouldReturnNullWhenNotFoundById() {
    // Arrange
    PanacheQuery<TransactionStatusEntity> query = mock(PanacheQuery.class);
    doReturn(query).when(repository).find("transactionStatusId", STATUS_ID);
    doReturn(null).when(query).firstResult();

    // Act
    TransactionStatusEntity result = repository.findById(STATUS_ID);

    // Assert
    assertEquals(null, result);
  }

  @Test
  @DisplayName("should use correct field name for ID query")
  @SuppressWarnings("unchecked")
  void shouldUseCorrectFieldNameForIdQuery() {
    // Arrange
    Integer specificId = 3;
    PanacheQuery<TransactionStatusEntity> query = mock(PanacheQuery.class);
    doReturn(query).when(repository).find("transactionStatusId", specificId);
    doReturn(null).when(query).firstResult();

    // Act
    repository.findById(specificId);

    // Assert
    verify(repository).find("transactionStatusId", specificId);
  }

  @Test
  @DisplayName("should return all entity fields when found")
  @SuppressWarnings("unchecked")
  void shouldReturnAllEntityFieldsWhenFound() {
    // Arrange
    TransactionStatusEntity entity = createEntity(3, "REJECTED", "Rejected");
    PanacheQuery<TransactionStatusEntity> query = mock(PanacheQuery.class);
    doReturn(query).when(repository).find("transactionStatusId", 3);
    doReturn(entity).when(query).firstResult();

    // Act
    TransactionStatusEntity result = repository.findById(3);

    // Assert
    assertEquals(3, result.getTransactionStatusId());
    assertEquals("REJECTED", result.getCode());
    assertEquals("Rejected", result.getName());
  }

  private TransactionStatusEntity createEntity() {
    return createEntity(STATUS_ID, STATUS_CODE, STATUS_NAME);
  }

  private TransactionStatusEntity createEntity(Integer id, String code, String name) {
    TransactionStatusEntity entity = new TransactionStatusEntity();
    entity.setTransactionStatusId(id);
    entity.setCode(code);
    entity.setName(name);
    return entity;
  }
}