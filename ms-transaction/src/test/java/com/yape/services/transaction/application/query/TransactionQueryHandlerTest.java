package com.yape.services.transaction.application.query;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.yape.services.transaction.domain.model.Transaction;
import com.yape.services.transaction.domain.model.TransactionStatus;
import com.yape.services.transaction.domain.repository.TransactionRepository;
import com.yape.services.transaction.domain.repository.TransactionStatusRepository;
import com.yape.services.transaction.domain.service.TransactionCacheService;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class TransactionQueryHandlerTest {

  @Mock
  private TransactionRepository transactionRepository;
  @Mock
  private TransactionStatusRepository transactionStatusRepository;
  @Mock
  private TransactionCacheService cacheService;

  private TransactionQueryHandler handler;

  private static final UUID TRANSACTION_EXTERNAL_ID = UUID.randomUUID();
  private static final int TRANSACTION_STATUS_ID = 1;

  @BeforeEach
  void setUp() {
    handler = new TransactionQueryHandler(
        transactionRepository,
        transactionStatusRepository,
        cacheService
    );
  }

  @Test
  @DisplayName("should return transaction from cache when present")
  void shouldReturnTransactionFromCacheWhenPresent() {
    // Arrange
    Transaction cachedTransaction = createTransaction();
    when(cacheService.getTransactionByExternalId(TRANSACTION_EXTERNAL_ID))
        .thenReturn(Optional.of(cachedTransaction));

    // Act
    Optional<Transaction> result = handler.getTransactionByExternalId(TRANSACTION_EXTERNAL_ID);

    // Assert
    assertTrue(result.isPresent());
    assertEquals(cachedTransaction, result.get());
    verify(transactionRepository, never()).findByExternalId(TRANSACTION_EXTERNAL_ID);
  }

  @Test
  @DisplayName("should fetch from database on cache miss")
  void shouldFetchFromDatabaseOnCacheMiss() {
    // Arrange
    Transaction dbTransaction = createTransaction();
    TransactionStatus status = createPendingStatus();

    when(cacheService.getTransactionByExternalId(TRANSACTION_EXTERNAL_ID))
        .thenReturn(Optional.empty());
    when(transactionRepository.findByExternalId(TRANSACTION_EXTERNAL_ID))
        .thenReturn(Optional.of(dbTransaction));
    when(transactionStatusRepository.findById(TRANSACTION_STATUS_ID))
        .thenReturn(Optional.of(status));

    // Act
    Optional<Transaction> result = handler.getTransactionByExternalId(TRANSACTION_EXTERNAL_ID);

    // Assert
    assertTrue(result.isPresent());
    assertEquals(dbTransaction, result.get());
    verify(transactionRepository).findByExternalId(TRANSACTION_EXTERNAL_ID);
  }

  @Test
  @DisplayName("should cache transaction after fetching from database")
  void shouldCacheTransactionAfterFetchingFromDatabase() {
    // Arrange
    Transaction dbTransaction = createTransaction();
    TransactionStatus status = createPendingStatus();

    when(cacheService.getTransactionByExternalId(TRANSACTION_EXTERNAL_ID))
        .thenReturn(Optional.empty());
    when(transactionRepository.findByExternalId(TRANSACTION_EXTERNAL_ID))
        .thenReturn(Optional.of(dbTransaction));
    when(transactionStatusRepository.findById(TRANSACTION_STATUS_ID))
        .thenReturn(Optional.of(status));

    // Act
    handler.getTransactionByExternalId(TRANSACTION_EXTERNAL_ID);

    // Assert
    verify(cacheService).saveTransaction(dbTransaction, "PENDING");
  }

  @Test
  @DisplayName("should return empty when transaction not found in cache or database")
  void shouldReturnEmptyWhenTransactionNotFound() {
    // Arrange
    when(cacheService.getTransactionByExternalId(TRANSACTION_EXTERNAL_ID))
        .thenReturn(Optional.empty());
    when(transactionRepository.findByExternalId(TRANSACTION_EXTERNAL_ID))
        .thenReturn(Optional.empty());

    // Act
    Optional<Transaction> result = handler.getTransactionByExternalId(TRANSACTION_EXTERNAL_ID);

    // Assert
    assertTrue(result.isEmpty());
    verify(cacheService, never()).saveTransaction(
        org.mockito.ArgumentMatchers.any(),
        org.mockito.ArgumentMatchers.any()
    );
  }

  @Test
  @DisplayName("should not cache when status not found")
  void shouldNotCacheWhenStatusNotFound() {
    // Arrange
    Transaction dbTransaction = createTransaction();

    when(cacheService.getTransactionByExternalId(TRANSACTION_EXTERNAL_ID))
        .thenReturn(Optional.empty());
    when(transactionRepository.findByExternalId(TRANSACTION_EXTERNAL_ID))
        .thenReturn(Optional.of(dbTransaction));
    when(transactionStatusRepository.findById(TRANSACTION_STATUS_ID))
        .thenReturn(Optional.empty());

    // Act
    Optional<Transaction> result = handler.getTransactionByExternalId(TRANSACTION_EXTERNAL_ID);

    // Assert
    assertTrue(result.isPresent());
    verify(cacheService, never()).saveTransaction(
        org.mockito.ArgumentMatchers.any(),
        org.mockito.ArgumentMatchers.any()
    );
  }

  private Transaction createTransaction() {
    return Transaction.builder()
        .transactionExternalId(TRANSACTION_EXTERNAL_ID)
        .accountExternalIdDebit(UUID.randomUUID())
        .accountExternalIdCredit(UUID.randomUUID())
        .transferTypeId(1)
        .transactionStatusId(TRANSACTION_STATUS_ID)
        .value(new BigDecimal("100.00"))
        .createdAt(LocalDateTime.now())
        .build();
  }

  private TransactionStatus createPendingStatus() {
    return TransactionStatus.builder()
        .transactionStatusId(TRANSACTION_STATUS_ID)
        .code("PENDING")
        .name("Pending")
        .build();
  }
}
