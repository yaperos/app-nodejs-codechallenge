package pe.com.yape.ms.transaction.model.domain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Pruebas unitarias para el Record Transaction (Dominio)
 * Verifica las reglas de negocio y comportamiento del modelo inmutable
 * 
 * @author Yape Engineering Team
 * @version 1.0.0
 */
@DisplayName("Transaction Domain Model Tests")
class TransactionTest {
    
    @Test
    @DisplayName("Debe crear una transacción válida con todos los campos")
    void shouldCreateValidTransaction() {
        // Given
        UUID transactionId = UUID.randomUUID();
        UUID debitAccount = UUID.randomUUID();
        UUID creditAccount = UUID.randomUUID();
        TransactionType type = TransactionType.TRANSFER;
        BigDecimal value = new BigDecimal("100.00");
        TransactionStatus status = TransactionStatus.PENDING;
        LocalDateTime now = LocalDateTime.now();
        
        // When
        Transaction transaction = new Transaction(
            transactionId,
            debitAccount,
            creditAccount,
            type,
            value,
            status,
            now,
            now
        );
        
        // Then
        assertNotNull(transaction);
        assertEquals(transactionId, transaction.transactionExternalId());
        assertEquals(debitAccount, transaction.accountExternalIdDebit());
        assertEquals(creditAccount, transaction.accountExternalIdCredit());
        assertEquals(type, transaction.transactionType());
        assertEquals(value, transaction.value());
        assertEquals(status, transaction.status());
        assertTrue(transaction.isPending());
    }
    
    @Test
    @DisplayName("Debe lanzar excepción cuando el ID de transacción es null")
    void shouldThrowExceptionWhenTransactionIdIsNull() {
        // Given
        UUID debitAccount = UUID.randomUUID();
        UUID creditAccount = UUID.randomUUID();
        BigDecimal value = new BigDecimal("100.00");
        LocalDateTime now = LocalDateTime.now();
        
        // When & Then
        assertThrows(IllegalArgumentException.class, () ->
            new Transaction(
                null, // ID null
                debitAccount,
                creditAccount,
                TransactionType.TRANSFER,
                value,
                TransactionStatus.PENDING,
                now,
                now
            )
        );
    }
    
    @Test
    @DisplayName("Debe lanzar excepción cuando el valor es cero o negativo")
    void shouldThrowExceptionWhenValueIsZeroOrNegative() {
        // Given
        UUID transactionId = UUID.randomUUID();
        UUID debitAccount = UUID.randomUUID();
        UUID creditAccount = UUID.randomUUID();
        LocalDateTime now = LocalDateTime.now();
        
        // When & Then - valor cero
        assertThrows(IllegalArgumentException.class, () ->
            new Transaction(
                transactionId,
                debitAccount,
                creditAccount,
                TransactionType.TRANSFER,
                BigDecimal.ZERO,
                TransactionStatus.PENDING,
                now,
                now
            )
        );
        
        // When & Then - valor negativo
        assertThrows(IllegalArgumentException.class, () ->
            new Transaction(
                transactionId,
                debitAccount,
                creditAccount,
                TransactionType.TRANSFER,
                new BigDecimal("-10.00"),
                TransactionStatus.PENDING,
                now,
                now
            )
        );
    }
    
    @Test
    @DisplayName("Debe crear una transacción en estado PENDING usando factory method")
    void shouldCreatePendingTransactionUsingFactoryMethod() {
        // Given
        UUID debitAccount = UUID.randomUUID();
        UUID creditAccount = UUID.randomUUID();
        BigDecimal value = new BigDecimal("250.00");
        
        // When
        Transaction transaction = Transaction.createPending(
            debitAccount,
            creditAccount,
            TransactionType.TRANSFER,
            value
        );
        
        // Then
        assertNotNull(transaction);
        assertNotNull(transaction.transactionExternalId());
        assertEquals(TransactionStatus.PENDING, transaction.status());
        assertTrue(transaction.isPending());
        assertFalse(transaction.isApproved());
        assertFalse(transaction.isRejected());
        assertNotNull(transaction.createdAt());
    }
    
    @Test
    @DisplayName("Debe crear una nueva instancia con estado actualizado (inmutabilidad)")
    void shouldCreateNewInstanceWithUpdatedStatus() {
        // Given
        Transaction originalTransaction = Transaction.createPending(
            UUID.randomUUID(),
            UUID.randomUUID(),
            TransactionType.TRANSFER,
            new BigDecimal("100.00")
        );
        
        // When
        Transaction approvedTransaction = originalTransaction.withStatus(TransactionStatus.APPROVED);
        
        // Then
        // La transacción original no debe cambiar
        assertTrue(originalTransaction.isPending());
        assertFalse(originalTransaction.isApproved());
        
        // La nueva transacción debe tener el estado actualizado
        assertFalse(approvedTransaction.isPending());
        assertTrue(approvedTransaction.isApproved());
        
        // Deben ser instancias diferentes
        assertNotSame(originalTransaction, approvedTransaction);
        
        // Pero con el mismo ID
        assertEquals(originalTransaction.transactionExternalId(), 
                    approvedTransaction.transactionExternalId());
    }
    
    @Test
    @DisplayName("Debe verificar correctamente los métodos de estado")
    void shouldVerifyStatusMethods() {
        // Given
        UUID id = UUID.randomUUID();
        UUID debitAccount = UUID.randomUUID();
        UUID creditAccount = UUID.randomUUID();
        BigDecimal value = new BigDecimal("100.00");
        LocalDateTime now = LocalDateTime.now();
        
        // When - PENDING
        Transaction pendingTransaction = new Transaction(
            id, debitAccount, creditAccount, TransactionType.TRANSFER,
            value, TransactionStatus.PENDING, now, now
        );
        
        // Then
        assertTrue(pendingTransaction.isPending());
        assertFalse(pendingTransaction.isApproved());
        assertFalse(pendingTransaction.isRejected());
        
        // When - APPROVED
        Transaction approvedTransaction = pendingTransaction.withStatus(TransactionStatus.APPROVED);
        
        // Then
        assertFalse(approvedTransaction.isPending());
        assertTrue(approvedTransaction.isApproved());
        assertFalse(approvedTransaction.isRejected());
        
        // When - REJECTED
        Transaction rejectedTransaction = pendingTransaction.withStatus(TransactionStatus.REJECTED);
        
        // Then
        assertFalse(rejectedTransaction.isPending());
        assertFalse(rejectedTransaction.isApproved());
        assertTrue(rejectedTransaction.isRejected());
    }
}

