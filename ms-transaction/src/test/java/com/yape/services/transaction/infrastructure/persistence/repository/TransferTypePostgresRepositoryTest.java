package com.yape.services.transaction.infrastructure.persistence.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.verify;

import com.yape.services.transaction.infrastructure.persistence.entity.TransferTypeEntity;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class TransferTypePostgresRepositoryTest {

  private TransferTypePostgresRepository repository;

  private static final Integer TRANSFER_TYPE_ID = 1;
  private static final String TRANSFER_TYPE_CODE = "INTERNAL";
  private static final String TRANSFER_TYPE_NAME = "Internal Transfer";

  @BeforeEach
  void setUp() {
    repository = spy(new TransferTypePostgresRepository());
  }

  @Test
  @DisplayName("should return entity when found by ID")
  @SuppressWarnings("unchecked")
  void shouldReturnEntityWhenFoundById() {
    // Arrange
    TransferTypeEntity entity = createEntity();
    PanacheQuery<TransferTypeEntity> query = mock(PanacheQuery.class);
    doReturn(query).when(repository).find("transferTypeId", TRANSFER_TYPE_ID);
    doReturn(entity).when(query).firstResult();

    // Act
    TransferTypeEntity result = repository.findByTransferTypeId(TRANSFER_TYPE_ID);

    // Assert
    assertNotNull(result);
    assertEquals(TRANSFER_TYPE_ID, result.getTransferTypeId());
    assertEquals(TRANSFER_TYPE_CODE, result.getCode());
    assertEquals(TRANSFER_TYPE_NAME, result.getName());
  }

  @Test
  @DisplayName("should return null when not found by ID")
  @SuppressWarnings("unchecked")
  void shouldReturnNullWhenNotFoundById() {
    // Arrange
    PanacheQuery<TransferTypeEntity> query = mock(PanacheQuery.class);
    doReturn(query).when(repository).find("transferTypeId", TRANSFER_TYPE_ID);
    doReturn(null).when(query).firstResult();

    // Act
    TransferTypeEntity result = repository.findByTransferTypeId(TRANSFER_TYPE_ID);

    // Assert
    assertNull(result);
  }

  @Test
  @DisplayName("should use correct field name for query")
  @SuppressWarnings("unchecked")
  void shouldUseCorrectFieldNameForQuery() {
    // Arrange
    Integer specificId = 99;
    PanacheQuery<TransferTypeEntity> query = mock(PanacheQuery.class);
    doReturn(query).when(repository).find("transferTypeId", specificId);
    doReturn(null).when(query).firstResult();

    // Act
    repository.findByTransferTypeId(specificId);

    // Assert
    verify(repository).find("transferTypeId", specificId);
  }

  @Test
  @DisplayName("should return entity with all fields mapped")
  @SuppressWarnings("unchecked")
  void shouldReturnEntityWithAllFieldsMapped() {
    // Arrange
    TransferTypeEntity entity = createEntity(2, "EXTERNAL", "External Transfer");
    PanacheQuery<TransferTypeEntity> query = mock(PanacheQuery.class);
    doReturn(query).when(repository).find("transferTypeId", 2);
    doReturn(entity).when(query).firstResult();

    // Act
    TransferTypeEntity result = repository.findByTransferTypeId(2);

    // Assert
    assertEquals(2, result.getTransferTypeId());
    assertEquals("EXTERNAL", result.getCode());
    assertEquals("External Transfer", result.getName());
  }

  @Test
  @DisplayName("should return all transfer types")
  void shouldReturnAllTransferTypes() {
    // Arrange
    List<TransferTypeEntity> entities = List.of(
        createEntity(1, "INTERNAL", "Internal Transfer"),
        createEntity(2, "EXTERNAL", "External Transfer"),
        createEntity(3, "INTERBANK", "Interbank Transfer")
    );
    doReturn(entities).when(repository).listAll();

    // Act
    List<TransferTypeEntity> result = repository.findAllTransferTypes();

    // Assert
    assertEquals(3, result.size());
    verify(repository).listAll();
  }

  @Test
  @DisplayName("should return empty list when no transfer types exist")
  void shouldReturnEmptyListWhenNoTransferTypesExist() {
    // Arrange
    doReturn(List.of()).when(repository).listAll();

    // Act
    List<TransferTypeEntity> result = repository.findAllTransferTypes();

    // Assert
    assertTrue(result.isEmpty());
  }

  @Test
  @DisplayName("should preserve order of results")
  void shouldPreserveOrderOfResults() {
    // Arrange
    List<TransferTypeEntity> entities = List.of(
        createEntity(3, "THIRD", "Third Type"),
        createEntity(1, "FIRST", "First Type"),
        createEntity(2, "SECOND", "Second Type")
    );
    doReturn(entities).when(repository).listAll();

    // Act
    List<TransferTypeEntity> result = repository.findAllTransferTypes();

    // Assert
    assertEquals(3, result.get(0).getTransferTypeId());
    assertEquals(1, result.get(1).getTransferTypeId());
    assertEquals(2, result.get(2).getTransferTypeId());
  }

  @Test
  @DisplayName("should delegate to listAll method")
  void shouldDelegateToListAllMethod() {
    // Arrange
    doReturn(List.of()).when(repository).listAll();

    // Act
    repository.findAllTransferTypes();

    // Assert
    verify(repository).listAll();
  }

  private TransferTypeEntity createEntity() {
    return createEntity(TRANSFER_TYPE_ID, TRANSFER_TYPE_CODE, TRANSFER_TYPE_NAME);
  }

  private TransferTypeEntity createEntity(Integer id, String code, String name) {
    TransferTypeEntity entity = new TransferTypeEntity();
    entity.setTransferTypeId(id);
    entity.setCode(code);
    entity.setName(name);
    return entity;
  }
}
