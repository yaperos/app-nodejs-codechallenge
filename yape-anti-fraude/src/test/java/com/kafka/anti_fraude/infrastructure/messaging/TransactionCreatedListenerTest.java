package com.kafka.anti_fraude.infrastructure.messaging;

import static org.mockito.Mockito.*;

import com.kafka.anti_fraude.application.usecase.ValidateTransactionUseCase;
import com.kafka.anti_fraude.infrastructure.messaging.event.TransactionCreatedEvent;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import com.kafka.anti_fraude.infrastructure.messaging.kafka.TransactionCreatedListener;

class TransactionCreatedListenerTest {

    private ValidateTransactionUseCase validateTransactionUseCase;
    private TransactionCreatedListener listener;

    @BeforeEach
    void setup() {
        validateTransactionUseCase = mock(ValidateTransactionUseCase.class);
        listener = new TransactionCreatedListener(validateTransactionUseCase);
    }

    @Test
    void listen_shouldCallValidateTransactionUseCase() {
        UUID transactionId = UUID.randomUUID();
        TransactionCreatedEvent event = new TransactionCreatedEvent(transactionId, 200.0);

        listener.listen(event);

        verify(validateTransactionUseCase).execute(any());
    }
}