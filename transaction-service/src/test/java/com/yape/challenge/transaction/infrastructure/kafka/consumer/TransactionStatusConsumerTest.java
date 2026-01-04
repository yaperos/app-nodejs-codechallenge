package com.yape.challenge.transaction.infrastructure.kafka.consumer;

import com.yape.challenge.common.dto.TransactionStatus;
import com.yape.challenge.common.dto.TransactionStatusEvent;
import com.yape.challenge.transaction.application.bus.CommandBus;
import com.yape.challenge.transaction.application.command.UpdateTransactionStatusCommand;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Transaction Status Consumer Tests")
class TransactionStatusConsumerTest {

    @Mock
    private CommandBus commandBus;

    @InjectMocks
    private TransactionStatusConsumer transactionStatusConsumer;

    private UUID transactionId;
    private TransactionStatusEvent statusEvent;

    @BeforeEach
    void setUp() {
        transactionId = UUID.randomUUID();
        statusEvent = TransactionStatusEvent.builder()
                .transactionExternalId(transactionId)
                .status(TransactionStatus.APPROVED)
                .build();
    }

    @Test
    @DisplayName("Should consume and process transaction status event successfully")
    void shouldConsumeAndProcessTransactionStatusEventSuccessfully() {
        // Given
        when(commandBus.dispatch(any(UpdateTransactionStatusCommand.class))).thenReturn(null);

        // When
        transactionStatusConsumer.consumeTransactionStatus(statusEvent);

        // Then
        verify(commandBus, times(1)).dispatch(any(UpdateTransactionStatusCommand.class));
        verify(commandBus).dispatch(argThat(command ->
                command instanceof UpdateTransactionStatusCommand &&
                        ((UpdateTransactionStatusCommand) command).getExternalId().equals(transactionId) &&
                        ((UpdateTransactionStatusCommand) command).getStatus().equals(TransactionStatus.APPROVED)
        ));
    }

    @Test
    @DisplayName("Should consume rejected transaction status")
    void shouldConsumeRejectedTransactionStatus() {
        // Given
        TransactionStatusEvent rejectedEvent = TransactionStatusEvent.builder()
                .transactionExternalId(transactionId)
                .status(TransactionStatus.REJECTED)
                .build();

        when(commandBus.dispatch(any(UpdateTransactionStatusCommand.class))).thenReturn(null);

        // When
        transactionStatusConsumer.consumeTransactionStatus(rejectedEvent);

        // Then
        verify(commandBus, times(1)).dispatch(any(UpdateTransactionStatusCommand.class));
        verify(commandBus).dispatch(argThat(command ->
                command instanceof UpdateTransactionStatusCommand &&
                        ((UpdateTransactionStatusCommand) command).getStatus().equals(TransactionStatus.REJECTED)
        ));
    }

    @Test
    @DisplayName("Should propagate exception when command bus fails")
    void shouldPropagateExceptionWhenCommandBusFails() {
        // Given
        RuntimeException exception = new RuntimeException("Command bus failed");
        doThrow(exception).when(commandBus).dispatch(any(UpdateTransactionStatusCommand.class));

        // When & Then
        RuntimeException thrown = assertThrows(RuntimeException.class, () ->
                transactionStatusConsumer.consumeTransactionStatus(statusEvent)
        );

        assertEquals("Command bus failed", thrown.getMessage());
        verify(commandBus, times(1)).dispatch(any(UpdateTransactionStatusCommand.class));
    }

    @Test
    @DisplayName("Should process multiple consecutive events")
    void shouldProcessMultipleConsecutiveEvents() {
        // Given
        TransactionStatusEvent event1 = TransactionStatusEvent.builder()
                .transactionExternalId(UUID.randomUUID())
                .status(TransactionStatus.APPROVED)
                .build();

        TransactionStatusEvent event2 = TransactionStatusEvent.builder()
                .transactionExternalId(UUID.randomUUID())
                .status(TransactionStatus.REJECTED)
                .build();

        when(commandBus.dispatch(any(UpdateTransactionStatusCommand.class))).thenReturn(null);

        // When
        transactionStatusConsumer.consumeTransactionStatus(event1);
        transactionStatusConsumer.consumeTransactionStatus(event2);

        // Then
        verify(commandBus, times(2)).dispatch(any(UpdateTransactionStatusCommand.class));
    }

    @Test
    @DisplayName("Should handle event with correct transaction id")
    void shouldHandleEventWithCorrectTransactionId() {
        // Given
        UUID specificTransactionId = UUID.randomUUID();
        TransactionStatusEvent specificEvent = TransactionStatusEvent.builder()
                .transactionExternalId(specificTransactionId)
                .status(TransactionStatus.APPROVED)
                .build();

        when(commandBus.dispatch(any(UpdateTransactionStatusCommand.class))).thenReturn(null);

        // When
        transactionStatusConsumer.consumeTransactionStatus(specificEvent);

        // Then
        verify(commandBus).dispatch(argThat(command ->
                ((UpdateTransactionStatusCommand) command).getExternalId().equals(specificTransactionId)
        ));
    }
}

