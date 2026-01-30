package com.yape.services.transaction.infrastructure.persistence;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.yape.services.transaction.domain.model.TransferType;
import com.yape.services.transaction.infrastructure.persistence.entity.TransferTypeEntity;
import com.yape.services.transaction.infrastructure.persistence.repository.TransferTypePostgresRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class TransferTypePersistenceTest {

  @Mock
  private TransferTypePostgresRepository repository;

  private TransferTypePersistence persistence;

  private static final Integer TRANSFER_TYPE_ID = 1;
  private static final String TRANSFER_TYPE_CODE = "INTERNAL";
  private static final String TRANSFER_TYPE_NAME = "Internal Transfer";

  @BeforeEach
  void setUp() {
    persistence = new TransferTypePersistence(repository);
  }

  @Test
  @DisplayName("should return transfer type when found by ID")
  void shouldReturnTransferTypeWhenFoundById() {
    // Given
    TransferTypeEntity entity = createEntity();
    when(repository.findByTransferTypeId(TRANSFER_TYPE_ID)).thenReturn(entity);

    // When
    Optional<TransferType> result = persistence.findById(TRANSFER_TYPE_ID);

    // Then
    assertTrue(result.isPresent());
    assertEquals(TRANSFER_TYPE_ID, result.get().getTransferTypeId());
    assertEquals(TRANSFER_TYPE_CODE, result.get().getCode());
    assertEquals(TRANSFER_TYPE_NAME, result.get().getName());
    verify(repository).findByTransferTypeId(TRANSFER_TYPE_ID);
  }

  @Test
  @DisplayName("should return empty when not found by ID")
  void shouldReturnEmptyWhenNotFoundById() {
    // Given
    when(repository.findByTransferTypeId(TRANSFER_TYPE_ID)).thenReturn(null);

    // When
    Optional<TransferType> result = persistence.findById(TRANSFER_TYPE_ID);

    // Then
    assertTrue(result.isEmpty());
    verify(repository).findByTransferTypeId(TRANSFER_TYPE_ID);
  }

  @Test
  @DisplayName("should map all entity fields to domain")
  void shouldMapAllEntityFieldsToDomain() {
    // Given
    TransferTypeEntity entity = createEntity();
    when(repository.findByTransferTypeId(TRANSFER_TYPE_ID)).thenReturn(entity);

    // When
    Optional<TransferType> result = persistence.findById(TRANSFER_TYPE_ID);

    // Then
    assertTrue(result.isPresent());
    TransferType type = result.get();
    assertEquals(entity.getTransferTypeId(), type.getTransferTypeId());
    assertEquals(entity.getCode(), type.getCode());
    assertEquals(entity.getName(), type.getName());
  }

  @Test
  @DisplayName("should return all transfer types")
  void shouldReturnAllTransferTypes() {
    // Given
    List<TransferTypeEntity> entities = List.of(
        createEntity(1, "INTERNAL", "Internal Transfer"),
        createEntity(2, "EXTERNAL", "External Transfer"),
        createEntity(3, "INTERBANK", "Interbank Transfer")
    );
    when(repository.findAllTransferTypes()).thenReturn(entities);

    // When
    List<TransferType> result = persistence.findAll();

    // Then
    assertEquals(3, result.size());
    assertEquals("INTERNAL", result.get(0).getCode());
    assertEquals("EXTERNAL", result.get(1).getCode());
    assertEquals("INTERBANK", result.get(2).getCode());
    verify(repository).findAllTransferTypes();
  }

  @Test
  @DisplayName("should return empty list when no transfer types exist")
  void shouldReturnEmptyListWhenNoTransferTypesExist() {
    // Given
    when(repository.findAllTransferTypes()).thenReturn(List.of());

    // When
    List<TransferType> result = persistence.findAll();

    // Then
    assertTrue(result.isEmpty());
    verify(repository).findAllTransferTypes();
  }

  @Test
  @DisplayName("should map all entities to domain objects")
  void shouldMapAllEntitiesToDomainObjects() {
    // Given
    List<TransferTypeEntity> entities = List.of(
        createEntity(1, "INTERNAL", "Internal Transfer"),
        createEntity(2, "EXTERNAL", "External Transfer")
    );
    when(repository.findAllTransferTypes()).thenReturn(entities);

    // When
    List<TransferType> result = persistence.findAll();

    // Then
    assertEquals(2, result.size());
    result.forEach(type -> {
      assertNotNull(type.getTransferTypeId());
      assertNotNull(type.getCode());
      assertNotNull(type.getName());
    });
  }

  @Test
  @DisplayName("should preserve order of transfer types")
  void shouldPreserveOrderOfTransferTypes() {
    // Given
    List<TransferTypeEntity> entities = List.of(
        createEntity(3, "THIRD", "Third"),
        createEntity(1, "FIRST", "First"),
        createEntity(2, "SECOND", "Second")
    );
    when(repository.findAllTransferTypes()).thenReturn(entities);

    // When
    List<TransferType> result = persistence.findAll();

    // Then
    assertEquals(3, result.size());
    assertEquals(3, result.get(0).getTransferTypeId());
    assertEquals(1, result.get(1).getTransferTypeId());
    assertEquals(2, result.get(2).getTransferTypeId());
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
