package com.yape.challenge.transaction.domain.entity;

import com.yape.challenge.common.dto.TransactionStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Transaction Entity Tests")
class TransactionTest {

    private Transaction transaction;

    @BeforeEach
    void setUp() {
        transaction = new Transaction();
    }

    @Test
    @DisplayName("Should generate UUID on pre-persist when external id is null")
    void shouldGenerateUuidOnPrePersist() {
        // When
        transaction.onCreate();

        // Then
        assertNotNull(transaction.getExternalId());
    }

    @Test
    @DisplayName("Should not override existing external id on pre-persist")
    void shouldNotOverrideExistingExternalId() {
        // Given
        UUID existingId = UUID.randomUUID();
        transaction.setExternalId(existingId);

        // When
        transaction.onCreate();

        // Then
        assertEquals(existingId, transaction.getExternalId());
    }

    @Test
    @DisplayName("Should set default status to PENDING on pre-persist")
    void shouldSetDefaultStatusToPending() {
        // When
        transaction.onCreate();

        // Then
        assertEquals(TransactionStatus.PENDING, transaction.getStatus());
    }

    @Test
    @DisplayName("Should not override existing status on pre-persist")
    void shouldNotOverrideExistingStatus() {
        // Given
        transaction.setStatus(TransactionStatus.APPROVED);

        // When
        transaction.onCreate();

        // Then
        assertEquals(TransactionStatus.APPROVED, transaction.getStatus());
    }

    @Test
    @DisplayName("Should create transaction with builder")
    void shouldCreateTransactionWithBuilder() {
        // Given
        UUID externalId = UUID.randomUUID();
        UUID debitId = UUID.randomUUID();
        UUID creditId = UUID.randomUUID();
        BigDecimal value = new BigDecimal("100.00");

        // When
        Transaction transaction = Transaction.builder()
                .externalId(externalId)
                .accountExternalIdDebit(debitId)
                .accountExternalIdCredit(creditId)
                .transferTypeId(1)
                .value(value)
                .status(TransactionStatus.PENDING)
                .build();

        // Then
        assertNotNull(transaction);
        assertEquals(externalId, transaction.getExternalId());
        assertEquals(debitId, transaction.getAccountExternalIdDebit());
        assertEquals(creditId, transaction.getAccountExternalIdCredit());
        assertEquals(1, transaction.getTransferTypeId());
        assertEquals(value, transaction.getValue());
        assertEquals(TransactionStatus.PENDING, transaction.getStatus());
    }

    @Test
    @DisplayName("Should support all transaction statuses")
    void shouldSupportAllTransactionStatuses() {
        // Test each status
        transaction.setStatus(TransactionStatus.PENDING);
        assertEquals(TransactionStatus.PENDING, transaction.getStatus());

        transaction.setStatus(TransactionStatus.APPROVED);
        assertEquals(TransactionStatus.APPROVED, transaction.getStatus());

        transaction.setStatus(TransactionStatus.REJECTED);
        assertEquals(TransactionStatus.REJECTED, transaction.getStatus());
    }
}

