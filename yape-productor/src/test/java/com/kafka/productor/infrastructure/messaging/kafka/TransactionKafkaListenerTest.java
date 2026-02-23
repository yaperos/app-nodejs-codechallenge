package com.kafka.productor.infrastructure.messaging.kafka;

import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import org.mockito.junit.jupiter.MockitoExtension;

import com.kafka.productor.application.usecase.service.update.UpdateTransactionStatusUseCase;
import com.kafka.productor.infrastructure.messaging.event.TransactionStatusUpdatedEvent;

@ExtendWith(MockitoExtension.class)
class TransactionKafkaListenerTest {

    @Mock
    private UpdateTransactionStatusUseCase updateTransactionStatusUseCase;

    @InjectMocks
    private TransactionKafkaListener listener;

    @Test
    void shouldExecuteUseCaseWhenEventReceived() {

        UUID id = UUID.randomUUID();
        String status = "APPROVED";

        TransactionStatusUpdatedEvent event =
                new TransactionStatusUpdatedEvent(id, status);

        listener.publishTransactionStatusUpdated(event);

        verify(updateTransactionStatusUseCase)
                .execute(id, status);
    }
}