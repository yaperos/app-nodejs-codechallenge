package com.yape.services.transaction.infrastructure.cache;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.yape.services.transaction.domain.model.Transaction;
import com.yape.services.transaction.infrastructure.config.TransactionCacheConfig;
import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.redisson.api.RMapCache;
import org.redisson.api.RedissonClient;
import org.redisson.client.codec.Codec;

@ExtendWith(MockitoExtension.class)
class TransactionCacheServiceImplTest {

  @Mock
  private RedissonClient redissonClient;
  @Mock
  private TransactionCacheConfig cacheConfig;
  @Mock
  private TransactionCacheConfig.Ttl ttlConfig;
  @Mock
  private RMapCache<String, Transaction> mapCache;

  private TransactionCacheServiceImpl cacheService;

  private static final UUID TRANSACTION_EXTERNAL_ID = UUID.randomUUID();
  private static final String MAP_NAME = "transactions";
  private static final String PREFIX = "transaction:";
  private static final long PENDING_TTL = 300L;
  private static final long APPROVED_TTL = 3600L;
  private static final long REJECTED_TTL = 3600L;

  @BeforeEach
  void setUp() {
    lenient().when(cacheConfig.mapName()).thenReturn(MAP_NAME);
    lenient().when(cacheConfig.prefix()).thenReturn(PREFIX);
    lenient().when(cacheConfig.ttl()).thenReturn(ttlConfig);
    lenient().doReturn(mapCache).when(redissonClient).getMapCache(anyString(), any(Codec.class));

    cacheService = new TransactionCacheServiceImpl(redissonClient, cacheConfig);
  }

  @Test
  @DisplayName("should save transaction with PENDING TTL")
  void shouldSaveTransactionWithPendingTtl() {
    // Arrange
    Transaction transaction = createTransaction();
    when(ttlConfig.pending()).thenReturn(PENDING_TTL);

    // Act
    cacheService.saveTransaction(transaction, "PENDING");

    // Assert
    String expectedKey = PREFIX + TRANSACTION_EXTERNAL_ID;
    verify(mapCache).put(expectedKey, transaction, PENDING_TTL, TimeUnit.SECONDS);
  }

  @Test
  @DisplayName("should save transaction with APPROVED TTL")
  void shouldSaveTransactionWithApprovedTtl() {
    // Arrange
    Transaction transaction = createTransaction();
    when(ttlConfig.approved()).thenReturn(APPROVED_TTL);

    // Act
    cacheService.saveTransaction(transaction, "APPROVED");

    // Assert
    String expectedKey = PREFIX + TRANSACTION_EXTERNAL_ID;
    verify(mapCache).put(expectedKey, transaction, APPROVED_TTL, TimeUnit.SECONDS);
  }

  @Test
  @DisplayName("should save transaction with REJECTED TTL")
  void shouldSaveTransactionWithRejectedTtl() {
    // Arrange
    Transaction transaction = createTransaction();
    when(ttlConfig.rejected()).thenReturn(REJECTED_TTL);

    // Act
    cacheService.saveTransaction(transaction, "REJECTED");

    // Assert
    String expectedKey = PREFIX + TRANSACTION_EXTERNAL_ID;
    verify(mapCache).put(expectedKey, transaction, REJECTED_TTL, TimeUnit.SECONDS);
  }

  @Test
  @DisplayName("should throw exception for unknown status")
  void shouldThrowExceptionForUnknownStatus() {
    // Arrange
    Transaction transaction = createTransaction();

    // Act/Then
    IllegalStateException thrown = assertThrows(
        IllegalStateException.class,
        () -> cacheService.saveTransaction(transaction, "UNKNOWN")
    );
    assertTrue(thrown.getMessage().contains("Unexpected value"));
  }

  @Test
  @DisplayName("should return transaction when found in cache")
  void shouldReturnTransactionWhenFoundInCache() {
    // Arrange
    Transaction transaction = createTransaction();
    String key = PREFIX + TRANSACTION_EXTERNAL_ID;
    when(mapCache.get(key)).thenReturn(transaction);

    // Act
    Optional<Transaction> result = cacheService
        .getTransactionByExternalId(TRANSACTION_EXTERNAL_ID);

    // Assert
    assertTrue(result.isPresent());
    assertEquals(transaction, result.get());
  }

  @Test
  @DisplayName("should return empty when not found in cache")
  void shouldReturnEmptyWhenNotFoundInCache() {
    // Arrange
    String key = PREFIX + TRANSACTION_EXTERNAL_ID;
    when(mapCache.get(key)).thenReturn(null);

    // Act
    Optional<Transaction> result = cacheService
        .getTransactionByExternalId(TRANSACTION_EXTERNAL_ID);

    // Assert
    assertTrue(result.isEmpty());
  }

  @Test
  @DisplayName("should update status and TTL when transaction exists in cache")
  void shouldUpdateStatusAndTtlWhenTransactionExists() {
    // Arrange
    Transaction transaction = createTransaction();
    String key = PREFIX + TRANSACTION_EXTERNAL_ID;
    when(mapCache.get(key)).thenReturn(transaction);
    when(ttlConfig.approved()).thenReturn(APPROVED_TTL);

    // Act
    cacheService.updateTransactionStatus(TRANSACTION_EXTERNAL_ID, 2, "APPROVED");

    // Assert
    assertEquals(2, transaction.getTransactionStatusId());
    verify(mapCache).put(key, transaction, APPROVED_TTL, TimeUnit.SECONDS);
  }

  @Test
  @DisplayName("should not update when transaction not in cache")
  void shouldNotUpdateWhenTransactionNotInCache() {
    // Arrange
    String key = PREFIX + TRANSACTION_EXTERNAL_ID;
    when(mapCache.get(key)).thenReturn(null);

    // Act
    cacheService.updateTransactionStatus(TRANSACTION_EXTERNAL_ID, 2, "APPROVED");

    // Assert
    verify(mapCache, never()).put(anyString(), any(), anyLong(), any());
  }

  private Transaction createTransaction() {
    return Transaction.builder()
        .transactionExternalId(TRANSACTION_EXTERNAL_ID)
        .accountExternalIdDebit(UUID.randomUUID())
        .accountExternalIdCredit(UUID.randomUUID())
        .transferTypeId(1)
        .transactionStatusId(1)
        .value(new BigDecimal("100.00"))
        .build();
  }
}
