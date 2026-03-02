package com.yape.transaction.application.usecase;

import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.model.TransactionStatus;
import com.yape.transaction.domain.port.out.TransactionCachePort;
import com.yape.transaction.domain.port.out.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("GetTransactionUseCase Unit Tests")
class GetTransactionUseCaseTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private TransactionCachePort transactionCachePort;

    @InjectMocks
    private GetTransactionUseCaseImpl getTransactionUseCase;

    private UUID externalId;
    private Transaction sampleTransaction;

    @BeforeEach
    void setUp() {
        externalId = UUID.randomUUID();
        sampleTransaction = Transaction.builder()
                .id(1L)
                .externalId(externalId)
                .accountDebit(UUID.randomUUID())
                .accountCredit(UUID.randomUUID())
                .transferTypeId(1)
                .value(new BigDecimal("750.00"))
                .status(TransactionStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("Should return transaction from cache when cache hit occurs")
    void shouldReturnTransactionFromCacheWhenCacheHitOccurs() {
        when(transactionCachePort.get(externalId)).thenReturn(Optional.of(sampleTransaction));

        Transaction result = getTransactionUseCase.getByExternalId(externalId);

        assertNotNull(result);
        assertEquals(externalId, result.getExternalId());
        assertEquals(sampleTransaction.getValue(), result.getValue());
        assertEquals(sampleTransaction.getStatus(), result.getStatus());

        verify(transactionCachePort).get(externalId);
        verifyNoInteractions(transactionRepository);
    }

    @Test
    @DisplayName("Should not call repository when transaction is found in cache")
    void shouldNotCallRepositoryWhenTransactionIsFoundInCache() {
        when(transactionCachePort.get(externalId)).thenReturn(Optional.of(sampleTransaction));

        getTransactionUseCase.getByExternalId(externalId);

        verify(transactionRepository, never()).findByExternalId(externalId);
    }

    @Test
    @DisplayName("Should retrieve from database and cache on cache miss")
    void shouldRetrieveFromDatabaseAndCacheOnCacheMiss() {
        when(transactionCachePort.get(externalId)).thenReturn(Optional.empty());
        when(transactionRepository.findByExternalId(externalId)).thenReturn(Optional.of(sampleTransaction));

        Transaction result = getTransactionUseCase.getByExternalId(externalId);

        assertNotNull(result);
        assertEquals(externalId, result.getExternalId());
        assertEquals(sampleTransaction.getValue(), result.getValue());

        verify(transactionCachePort).get(externalId);
        verify(transactionRepository).findByExternalId(externalId);
        verify(transactionCachePort).put(sampleTransaction);
    }

    @Test
    @DisplayName("Should cache the transaction after retrieving from database")
    void shouldCacheTransactionAfterRetrievingFromDatabase() {
        when(transactionCachePort.get(externalId)).thenReturn(Optional.empty());
        when(transactionRepository.findByExternalId(externalId)).thenReturn(Optional.of(sampleTransaction));

        getTransactionUseCase.getByExternalId(externalId);

        verify(transactionCachePort).put(sampleTransaction);
    }

    @Test
    @DisplayName("Should throw exception when transaction is not found")
    void shouldThrowExceptionWhenTransactionIsNotFound() {
        UUID nonExistentId = UUID.randomUUID();
        when(transactionCachePort.get(nonExistentId)).thenReturn(Optional.empty());
        when(transactionRepository.findByExternalId(nonExistentId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> getTransactionUseCase.getByExternalId(nonExistentId)
        );

        assertEquals("Transaction not found with externalId: " + nonExistentId, exception.getMessage());
    }

    @Test
    @DisplayName("Should not cache when transaction is not found in database")
    void shouldNotCacheWhenTransactionIsNotFoundInDatabase() {
        UUID nonExistentId = UUID.randomUUID();
        when(transactionCachePort.get(nonExistentId)).thenReturn(Optional.empty());
        when(transactionRepository.findByExternalId(nonExistentId)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> getTransactionUseCase.getByExternalId(nonExistentId));

        verify(transactionCachePort, never()).put(sampleTransaction);
    }
}
