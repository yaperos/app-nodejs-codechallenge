package com.jotace.transaction;

import com.jotace.transaction.application.port.out.EventProducerPort;
import com.jotace.transaction.application.port.out.TransactionRepositoryPort;
import com.jotace.transaction.application.service.TransactionService;
import com.jotace.transaction.domain.model.Transaction;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

// Uses MockitoExtension to enable annotation processing for Mockito mocks
@ExtendWith(MockitoExtension.class)
public class TransactionServiceTest {

    // Mock the external dependencies (Outgoing Ports)
    @Mock
    private TransactionRepositoryPort transactionRepositoryPort;

    @Mock
    private EventProducerPort eventProducer;

    // Inject the mocks into the service class we want to test
    @InjectMocks
    private TransactionService transactionService;

    // Fixed dummy data for testing
    private static final String ACCOUNT_DEBIT = "acc-debit-123";
    private static final String ACCOUNT_CREDIT = "acc-credit-456";
    private static final int TRANSFER_TYPE_ID = 1;
    private static final double VALUE = 100.00;
    private static final UUID EXTERNAL_ID = UUID.randomUUID();
    private static final Instant CREATED_AT = Instant.now();
    private static final String STATUS_PENDING = "pending";

    // Setup method to initialize the service, although @InjectMocks handles it
    @BeforeEach
    void setUp() {
        // Optional: Can be used for shared setup logic if needed
    }

    @Test
    void createTransaction_shouldPersistAndPublishEvent() {
        // Arrange
        // 1. Prepare the transaction object that the repository will return after persistence.
        // It must include the generated UUID and creation timestamp (which the DB/Adapter normally provides).
        Transaction transactionAfterSave = new Transaction(
                EXTERNAL_ID,
                ACCOUNT_DEBIT,
                ACCOUNT_CREDIT,
                TRANSFER_TYPE_ID,
                VALUE,
                STATUS_PENDING,
                CREATED_AT
        );

        // ArgumentCaptor to capture the Transaction object passed to the save method
        ArgumentCaptor<Transaction> captor = ArgumentCaptor.forClass(Transaction.class);

        // Define Mock Behavior:
        // When the repository's save method is called with ANY Transaction object,
        // return the prepared 'transactionAfterSave'.
        when(transactionRepositoryPort.save(any(Transaction.class))).thenReturn(transactionAfterSave);

        // Act
        Transaction result = transactionService.createTransaction(
                ACCOUNT_DEBIT,
                ACCOUNT_CREDIT,
                TRANSFER_TYPE_ID,
                VALUE
        );

        // Assert

        // 1. Verify the persistence interaction
        // Verify that the save method was called exactly once and capture the argument passed
        verify(transactionRepositoryPort, times(1)).save(captor.capture());

        // Assert on the initial state of the transaction before saving:
        Transaction transactionBeforeSave = captor.getValue();
        assertEquals(ACCOUNT_DEBIT, transactionBeforeSave.accountExternalIdDebit());
        assertEquals(ACCOUNT_CREDIT, transactionBeforeSave.accountExternalIdCredit());
        assertEquals(STATUS_PENDING, transactionBeforeSave.transactionStatus());
        // Verify that the external ID and creation time are null/default (as they are generated later)
        assertNotNull(transactionBeforeSave.transactionExternalId());
        assertNotNull(transactionBeforeSave.createdAt());

        // 2. Verify the event publishing interaction
        // Verify that the event producer was called exactly once with the *saved* transaction
        verify(eventProducer, times(1)).sendTransactionCreatedEvent(transactionAfterSave);

        // 3. Verify the final result
        // Check if the returned transaction matches the one provided by the mock repository
        assertNotNull(result);
        assertEquals(EXTERNAL_ID, result.transactionExternalId());
        assertEquals(STATUS_PENDING, result.transactionStatus());
    }

    @Test
    void createTransaction_shouldThrowException_whenRepositoryFails() {
        // Arrange
        // Define Mock Behavior: Throw an exception when the repository's save method is called
        when(transactionRepositoryPort.save(any(Transaction.class))).thenThrow(new RuntimeException("Database error"));

        // Act & Assert
        // Verify that calling the service method throws the expected exception
        assertThrows(RuntimeException.class, () ->
                transactionService.createTransaction(ACCOUNT_DEBIT, ACCOUNT_CREDIT, TRANSFER_TYPE_ID, VALUE)
        );

        // Ensure that if persistence fails, no event is published
        verify(eventProducer, never()).sendTransactionCreatedEvent(any(Transaction.class));
    }
}
