package pe.com.yape.ms.transaction.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pe.com.yape.ms.transaction.model.domain.Transaction;
import pe.com.yape.ms.transaction.model.domain.TransactionStatus;
import pe.com.yape.ms.transaction.model.domain.TransactionType;
import pe.com.yape.ms.transaction.service.port.TransactionRepositoryPort;
import pe.com.yape.ms.transaction.service.impl.CreateTransactionUseCaseImpl;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Pruebas unitarias para CreateTransactionUseCase (TDD - GREEN Phase)
 * Con implementación completa - Las pruebas ahora PASAN
 * 
 * Con CDC: Debezium capturará automáticamente los cambios desde PostgreSQL WAL
 * y publicará eventos a Kafka. No necesitamos tabla Outbox.
 * 
 * @author Yape Engineering Team
 * @version 1.0.0
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Create Transaction Use Case Tests - GREEN Phase")
class CreateTransactionUseCaseTest {
    
    @Mock
    private TransactionRepositoryPort transactionRepository;
    
    private CreateTransactionUseCase createTransactionUseCase;
    
    @BeforeEach
    void setUp() {
        // Ahora SÍ existe la implementación
        createTransactionUseCase = new CreateTransactionUseCaseImpl(
            transactionRepository
        );
    }
    
    @Test
    @DisplayName("RED: Debe crear una transacción con estado PENDING")
    void shouldCreateTransactionWithPendingStatus() {
        // Given
        UUID debitAccount = UUID.randomUUID();
        UUID creditAccount = UUID.randomUUID();
        int transferTypeId = TransactionType.TRANSFER.getId();
        BigDecimal value = new BigDecimal("500.00");
        
        Transaction expectedTransaction = Transaction.createPending(
            debitAccount,
            creditAccount,
            TransactionType.TRANSFER,
            value
        );
        
        when(transactionRepository.save(any(Transaction.class)))
            .thenReturn(expectedTransaction);
        
        // When
        Transaction result = createTransactionUseCase.execute(
            debitAccount,
            creditAccount,
            transferTypeId,
            value
        );
        
        // Then
        assertNotNull(result);
        assertEquals(TransactionStatus.PENDING, result.status());
        assertEquals(value, result.value());
        assertEquals(debitAccount, result.accountExternalIdDebit());
        assertEquals(creditAccount, result.accountExternalIdCredit());
        
        // Verificar que se guardó en la BD
        // Debezium CDC capturará este cambio automáticamente
        verify(transactionRepository, times(1)).save(any(Transaction.class));
    }
    
    @Test
    @DisplayName("RED: Debe lanzar excepción cuando el valor es inválido")
    void shouldThrowExceptionWhenValueIsInvalid() {
        // Given
        UUID debitAccount = UUID.randomUUID();
        UUID creditAccount = UUID.randomUUID();
        int transferTypeId = TransactionType.TRANSFER.getId();
        BigDecimal invalidValue = BigDecimal.ZERO;
        
        // When & Then
        assertThrows(IllegalArgumentException.class, () ->
            createTransactionUseCase.execute(
                debitAccount,
                creditAccount,
                transferTypeId,
                invalidValue
            )
        );
        
        verify(transactionRepository, never()).save(any(Transaction.class));
    }
    
    @Test
    @DisplayName("RED: Debe validar que las cuentas no sean null")
    void shouldValidateAccountsAreNotNull() {
        // Given
        int transferTypeId = TransactionType.TRANSFER.getId();
        BigDecimal value = new BigDecimal("100.00");
        
        // When & Then - cuenta débito null
        assertThrows(IllegalArgumentException.class, () ->
            createTransactionUseCase.execute(
                null,
                UUID.randomUUID(),
                transferTypeId,
                value
            )
        );
        
        // When & Then - cuenta crédito null
        assertThrows(IllegalArgumentException.class, () ->
            createTransactionUseCase.execute(
                UUID.randomUUID(),
                null,
                transferTypeId,
                value
            )
        );
        
        verify(transactionRepository, never()).save(any(Transaction.class));
    }
    
    @Test
    @DisplayName("RED: Debe crear transacción y Debezium CDC capturará el cambio automáticamente")
    void shouldCreateTransactionAndDebeziumWillCaptureChange() {
        // Given
        UUID debitAccount = UUID.randomUUID();
        UUID creditAccount = UUID.randomUUID();
        int transferTypeId = TransactionType.TRANSFER.getId();
        BigDecimal value = new BigDecimal("750.00");
        
        Transaction transaction = Transaction.createPending(
            debitAccount,
            creditAccount,
            TransactionType.TRANSFER,
            value
        );
        
        when(transactionRepository.save(any(Transaction.class)))
            .thenReturn(transaction);
        
        // When
        Transaction result = createTransactionUseCase.execute(
            debitAccount,
            creditAccount,
            transferTypeId,
            value
        );
        
        // Then
        assertNotNull(result);
        assertNotNull(result.transactionExternalId());
        assertEquals(TransactionStatus.PENDING, result.status());
        
        // Solo verificamos que se guardó en BD
        // Debezium CDC capturará este INSERT automáticamente desde PostgreSQL WAL
        // y publicará el evento 'transaction.created' a Kafka
        verify(transactionRepository, times(1)).save(any(Transaction.class));
    }
}

