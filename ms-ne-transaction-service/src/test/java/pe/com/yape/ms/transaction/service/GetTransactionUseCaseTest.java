package pe.com.yape.ms.transaction.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pe.com.yape.ms.transaction.application.exception.TransactionNotFoundException;
import pe.com.yape.ms.transaction.model.domain.Transaction;
import pe.com.yape.ms.transaction.model.domain.TransactionType;
import pe.com.yape.ms.transaction.service.port.CacheRepositoryPort;
import pe.com.yape.ms.transaction.service.port.TransactionRepositoryPort;
import pe.com.yape.ms.transaction.service.impl.GetTransactionUseCaseImpl;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

/**
 * Pruebas unitarias para GetTransactionUseCase (TDD - GREEN Phase)
 * Verifica el patrón Cache-Aside para lecturas de alto volumen
 * 
 * @author Yape Engineering Team
 * @version 1.0.0
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Get Transaction Use Case Tests - GREEN Phase")
class GetTransactionUseCaseTest {
    
    @Mock
    private TransactionRepositoryPort transactionRepository;
    
    @Mock
    private CacheRepositoryPort cacheRepository;
    
    private GetTransactionUseCase getTransactionUseCase;
    
    @BeforeEach
    void setUp() {
        // Ahora SÍ existe la implementación
        getTransactionUseCase = new GetTransactionUseCaseImpl(
            transactionRepository,
            cacheRepository
        );
    }
    
    @Test
    @DisplayName("RED: Debe obtener transacción desde cache si existe")
    void shouldGetTransactionFromCacheWhenExists() {
        // Given
        UUID transactionId = UUID.randomUUID();
        Transaction cachedTransaction = Transaction.createPending(
            UUID.randomUUID(),
            UUID.randomUUID(),
            TransactionType.TRANSFER,
            new BigDecimal("100.00")
        );
        
        when(cacheRepository.findByExternalId(transactionId))
            .thenReturn(Optional.of(cachedTransaction));
        
        // When
        Transaction result = getTransactionUseCase.execute(transactionId);
        
        // Then
        assertNotNull(result);
        assertEquals(cachedTransaction, result);
        verify(cacheRepository, times(1)).findByExternalId(transactionId);
        verify(transactionRepository, never()).findByExternalId(any());
    }
    
    @Test
    @DisplayName("RED: Debe obtener transacción de DB y guardar en cache si no existe en cache")
    void shouldGetTransactionFromDatabaseAndCacheIt() {
        // Given
        UUID transactionId = UUID.randomUUID();
        Transaction dbTransaction = Transaction.createPending(
            UUID.randomUUID(),
            UUID.randomUUID(),
            TransactionType.TRANSFER,
            new BigDecimal("200.00")
        );
        
        when(cacheRepository.findByExternalId(transactionId))
            .thenReturn(Optional.empty());
        when(transactionRepository.findByExternalId(transactionId))
            .thenReturn(Optional.of(dbTransaction));
        
        // When
        Transaction result = getTransactionUseCase.execute(transactionId);
        
        // Then
        assertNotNull(result);
        assertEquals(dbTransaction, result);
        verify(cacheRepository, times(1)).findByExternalId(transactionId);
        verify(transactionRepository, times(1)).findByExternalId(transactionId);
        verify(cacheRepository, times(1)).save(eq(dbTransaction), anyLong());
    }
    
    @Test
    @DisplayName("GREEN: Debe lanzar excepción cuando la transacción no existe")
    void shouldThrowExceptionWhenTransactionNotFound() {
        // Given
        UUID transactionId = UUID.randomUUID();
        
        when(cacheRepository.findByExternalId(transactionId))
            .thenReturn(Optional.empty());
        when(transactionRepository.findByExternalId(transactionId))
            .thenReturn(Optional.empty());
        
        // When & Then
        assertThrows(TransactionNotFoundException.class, () ->
            getTransactionUseCase.execute(transactionId)
        );
        
        verify(cacheRepository, times(1)).findByExternalId(transactionId);
        verify(transactionRepository, times(1)).findByExternalId(transactionId);
        verify(cacheRepository, never()).save(any(), anyLong());
    }
    
    @Test
    @DisplayName("RED: Debe implementar correctamente el patrón Cache-Aside")
    void shouldImplementCacheAsidePattern() {
        // Given
        UUID transactionId = UUID.randomUUID();
        Transaction transaction = Transaction.createPending(
            UUID.randomUUID(),
            UUID.randomUUID(),
            TransactionType.TRANSFER,
            new BigDecimal("300.00")
        );
        
        // Simular cache miss
        when(cacheRepository.findByExternalId(transactionId))
            .thenReturn(Optional.empty());
        when(transactionRepository.findByExternalId(transactionId))
            .thenReturn(Optional.of(transaction));
        
        // When
        getTransactionUseCase.execute(transactionId);
        
        // Then - Verificar orden: cache -> DB -> cache save
        var inOrder = inOrder(cacheRepository, transactionRepository);
        inOrder.verify(cacheRepository).findByExternalId(transactionId);
        inOrder.verify(transactionRepository).findByExternalId(transactionId);
        inOrder.verify(cacheRepository).save(transaction, 3600L); // TTL 1 hora
    }
}

