package com.yape.transaction.infrastructure.adapter.in.kafka;

import com.yape.transaction.application.port.out.TransactionRepositoryPort;
import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.model.TransactionStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class TransactionKafkaConsumerTest {

    @Mock
    private TransactionRepositoryPort transactionRepository;

    @InjectMocks
    private TransactionKafkaConsumer transactionKafkaConsumer;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void consumeTransactionCreated_ShouldApprove_WhenValueIsLessThanOrEqual1000() {
        // Arrange
        Transaction transaction = Transaction.builder()
                .transactionExternalId(UUID.randomUUID())
                .value(new BigDecimal("500"))
                .status(TransactionStatus.PENDING)
                .build();

        // Act
        transactionKafkaConsumer.consumeTransactionCreated(transaction);

        // Assert
        assertEquals(TransactionStatus.APPROVED, transaction.getStatus());
        verify(transactionRepository, times(1)).save(transaction);
    }

    @Test
    void consumeTransactionCreated_ShouldReject_WhenValueIsGreaterThan1000() {
        // Arrange
        Transaction transaction = Transaction.builder()
                .transactionExternalId(UUID.randomUUID())
                .value(new BigDecimal("1500"))
                .status(TransactionStatus.PENDING)
                .build();

        // Act
        transactionKafkaConsumer.consumeTransactionCreated(transaction);

        // Assert
        assertEquals(TransactionStatus.REJECTED, transaction.getStatus());
        verify(transactionRepository, times(1)).save(transaction);
    }
}
