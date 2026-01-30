package com.yape.services.transaction.application.query;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.yape.services.transaction.domain.model.TransferType;
import com.yape.services.transaction.domain.repository.TransferTypeRepository;
import com.yape.services.transaction.domain.service.TransferTypeCacheService;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class TransferTypeQueryHandlerTest {

  @Mock
  private TransferTypeRepository transferTypeRepository;
  @Mock
  private TransferTypeCacheService cacheService;

  private TransferTypeQueryHandler handler;

  private static final int TRANSFER_TYPE_ID = 1;

  @BeforeEach
  void setUp() {
    handler = new TransferTypeQueryHandler(transferTypeRepository, cacheService);
  }

  @Test
  @DisplayName("should return transfer type from cache when present")
  void shouldReturnTransferTypeFromCacheWhenPresent() {
    // Arrange
    TransferType cachedTransferType = createTransferType(TRANSFER_TYPE_ID);
    when(cacheService.findById(TRANSFER_TYPE_ID))
        .thenReturn(Optional.of(cachedTransferType));

    // Act
    Optional<TransferType> result = handler.getTransferTypeById(TRANSFER_TYPE_ID);

    // Assert
    assertTrue(result.isPresent());
    assertSame(cachedTransferType, result.get());
    verify(transferTypeRepository, never()).findById(TRANSFER_TYPE_ID);
  }

  @Test
  @DisplayName("should fetch from database on cache miss")
  void shouldFetchFromDatabaseOnCacheMiss() {
    // Arrange
    TransferType dbTransferType = createTransferType(TRANSFER_TYPE_ID);
    when(cacheService.findById(TRANSFER_TYPE_ID))
        .thenReturn(Optional.empty());
    when(transferTypeRepository.findById(TRANSFER_TYPE_ID))
        .thenReturn(Optional.of(dbTransferType));

    // Act
    Optional<TransferType> result = handler.getTransferTypeById(TRANSFER_TYPE_ID);

    // Assert
    assertTrue(result.isPresent());
    assertEquals(dbTransferType, result.get());
    verify(transferTypeRepository).findById(TRANSFER_TYPE_ID);
  }

  @Test
  @DisplayName("should cache transfer type after fetching from database")
  void shouldCacheTransferTypeAfterFetchingFromDatabase() {
    // Arrange
    TransferType dbTransferType = createTransferType(TRANSFER_TYPE_ID);
    when(cacheService.findById(TRANSFER_TYPE_ID))
        .thenReturn(Optional.empty());
    when(transferTypeRepository.findById(TRANSFER_TYPE_ID))
        .thenReturn(Optional.of(dbTransferType));

    // Act
    handler.getTransferTypeById(TRANSFER_TYPE_ID);

    // Assert
    verify(cacheService).save(dbTransferType);
  }

  @Test
  @DisplayName("should return empty when transfer type not found")
  void shouldReturnEmptyWhenTransferTypeNotFound() {
    // Arrange
    when(cacheService.findById(TRANSFER_TYPE_ID))
        .thenReturn(Optional.empty());
    when(transferTypeRepository.findById(TRANSFER_TYPE_ID))
        .thenReturn(Optional.empty());

    // Act
    Optional<TransferType> result = handler.getTransferTypeById(TRANSFER_TYPE_ID);

    // Assert
    assertFalse(result.isPresent());
    verify(cacheService, never()).save(org.mockito.ArgumentMatchers.any());
  }

  @Test
  @DisplayName("should return transfer types from cache when present")
  void shouldReturnTransferTypesFromCacheWhenPresent() {
    // Arrange
    List<TransferType> cachedTypes = List.of(
        createTransferType(1),
        createTransferType(2)
    );
    when(cacheService.findAll()).thenReturn(Optional.of(cachedTypes));

    // Act
    List<TransferType> result = handler.getAll();

    // Assert
    assertEquals(2, result.size());
    assertEquals(cachedTypes, result);
    verify(transferTypeRepository, never()).findAll();
  }

  @Test
  @DisplayName("should cache all transfer types after fetching from database")
  void shouldCacheAllTransferTypesAfterFetchingFromDatabase() {
    // Arrange
    List<TransferType> dbTypes = List.of(
        createTransferType(1),
        createTransferType(2)
    );
    when(cacheService.findAll()).thenReturn(Optional.empty());
    when(transferTypeRepository.findAll()).thenReturn(dbTypes);

    // Act
    handler.getAll();

    // Assert
    verify(cacheService).saveAll(dbTypes);
  }

  @Test
  @DisplayName("should return empty list when no transfer types found")
  void shouldReturnEmptyListWhenNoTransferTypesFound() {
    // Arrange
    when(cacheService.findAll()).thenReturn(Optional.empty());
    when(transferTypeRepository.findAll()).thenReturn(List.of());

    // Act
    List<TransferType> result = handler.getAll();

    // Assert
    assertTrue(result.isEmpty());
    verify(cacheService).saveAll(List.of());
  }

  private TransferType createTransferType(int id) {
    return TransferType.builder()
        .transferTypeId(id)
        .code("TRANSFER_" + id)
        .name("Transfer Type " + id)
        .build();
  }
}
