package com.yape.services.transaction.infrastructure.cache;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.yape.services.transaction.domain.model.TransferType;
import com.yape.services.transaction.infrastructure.config.TransferTypeCacheConfig;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.redisson.api.RMapCache;
import org.redisson.api.RedissonClient;
import org.redisson.client.codec.Codec;

@ExtendWith(MockitoExtension.class)
class TransferTypeCacheServiceImplTest {

  @Mock
  private RedissonClient redissonClient;
  @Mock
  private TransferTypeCacheConfig cacheConfig;
  @Mock
  private RMapCache<String, TransferType> mapCache;

  private TransferTypeCacheServiceImpl cacheService;

  private static final String MAP_NAME = "transfer-types";
  private static final String PREFIX = "transfer_type:";
  private static final long TTL = 86400L;

  @BeforeEach
  void setUp() {
    lenient().when(cacheConfig.mapName()).thenReturn(MAP_NAME);
    lenient().when(cacheConfig.prefix()).thenReturn(PREFIX);
    lenient().doReturn(mapCache).when(redissonClient).getMapCache(anyString(), any(Codec.class));

    cacheService = new TransferTypeCacheServiceImpl(redissonClient, cacheConfig);
  }

  @Nested
  @DisplayName("save")
  class SaveTests {

    @Test
    @DisplayName("should save transfer type with correct TTL")
    void shouldSaveTransferTypeWithCorrectTtl() {
      // Arrange
      TransferType transferType = createTransferType(1);
      when(cacheConfig.ttl()).thenReturn(TTL);

      // Act
      cacheService.save(transferType);

      // Assert
      String expectedKey = PREFIX + "1";
      verify(mapCache).put(expectedKey, transferType, TTL, TimeUnit.SECONDS);
    }
  }

  @Nested
  @DisplayName("saveAll")
  class SaveAllTests {

    @Test
    @DisplayName("should save all transfer types")
    void shouldSaveAllTransferTypes() {
      // Arrange
      List<TransferType> transferTypes = List.of(
          createTransferType(1),
          createTransferType(2),
          createTransferType(3)
      );
      when(cacheConfig.ttl()).thenReturn(TTL);

      // Act
      cacheService.saveAll(transferTypes);

      // Assert
      verify(mapCache, times(3)).put(any(), any(), eq(TTL), eq(TimeUnit.SECONDS));
    }

    @Test
    @DisplayName("should handle empty list")
    void shouldHandleEmptyList() {
      // Arrange
      List<TransferType> transferTypes = List.of();

      // Act
      cacheService.saveAll(transferTypes);

      // Assert
      verify(mapCache, times(0)).put(any(), any(), anyLong(), any());
    }
  }

  @Test
  @DisplayName("should return transfer type when found in cache")
  void shouldReturnTransferTypeWhenFoundInCache() {
    // Arrange
    TransferType transferType = createTransferType(1);
    String key = PREFIX + "1";
    when(mapCache.get(key)).thenReturn(transferType);

    // Act
    Optional<TransferType> result = cacheService.findById(1);

    // Assert
    assertTrue(result.isPresent());
    assertEquals(transferType, result.get());
  }

  @Test
  @DisplayName("should return empty when not found in cache")
  void shouldReturnEmptyWhenNotFoundInCache() {
    // Arrange
    String key = PREFIX + "1";
    when(mapCache.get(key)).thenReturn(null);

    // Act
    Optional<TransferType> result = cacheService.findById(1);

    // Assert
    assertTrue(result.isEmpty());
  }

  @Test
  @DisplayName("should return all transfer types when cache is not empty")
  void shouldReturnAllTransferTypesWhenCacheNotEmpty() {
    // Arrange
    TransferType type1 = createTransferType(1);
    TransferType type2 = createTransferType(2);
    Collection<TransferType> values = List.of(type1, type2);

    when(mapCache.isEmpty()).thenReturn(false);
    when(mapCache.values()).thenReturn(values);

    // Act
    Optional<List<TransferType>> result = cacheService.findAll();

    // Assert
    assertTrue(result.isPresent());
    assertEquals(2, result.get().size());
  }

  @Test
  @DisplayName("should return empty when cache is empty")
  void shouldReturnEmptyWhenCacheIsEmpty() {
    // Arrange
    when(mapCache.isEmpty()).thenReturn(true);

    // Act
    Optional<List<TransferType>> result = cacheService.findAll();

    // Assert
    assertTrue(result.isEmpty());
  }

  @Test
  @DisplayName("should deduplicate transfer types by ID")
  void shouldDeduplicateTransferTypesById() {
    // Arrange
    TransferType type1 = createTransferType(1);
    TransferType type1Duplicate = createTransferType(1);
    TransferType type2 = createTransferType(2);
    Collection<TransferType> values = List.of(type1, type1Duplicate, type2);

    when(mapCache.isEmpty()).thenReturn(false);
    when(mapCache.values()).thenReturn(values);

    // Act
    Optional<List<TransferType>> result = cacheService.findAll();

    // Assert
    assertTrue(result.isPresent());
    assertEquals(2, result.get().size());
  }

  private TransferType createTransferType(int id) {
    return TransferType.builder()
        .transferTypeId(id)
        .code("TYPE_" + id)
        .name("Transfer Type " + id)
        .build();
  }
}
