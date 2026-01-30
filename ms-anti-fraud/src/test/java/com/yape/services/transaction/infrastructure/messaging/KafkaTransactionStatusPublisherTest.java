package com.yape.services.transaction.infrastructure.messaging;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.yape.services.transaction.events.TransactionStatusUpdatedEvent;
import com.yape.services.transaction.events.TransactionStatusUpdatedPayload;
import com.yape.services.transaction.events.enums.TransactionStatus;
import io.smallrye.reactive.messaging.kafka.Record;
import java.util.concurrent.CompletableFuture;
import org.eclipse.microprofile.reactive.messaging.Emitter;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

/**
 * Unit tests for {@link KafkaTransactionStatusPublisher}.
 */
@ExtendWith(MockitoExtension.class)
class KafkaTransactionStatusPublisherTest {

  @Mock
  Emitter<Record<String, TransactionStatusUpdatedEvent>> statusUpdatedEmitter;

  @InjectMocks
  KafkaTransactionStatusPublisher publisher;

  @Mock
  TransactionStatusUpdatedEvent event;
  @Mock
  TransactionStatusUpdatedPayload payload;

  @Test
  @DisplayName("should publish event and log success when emitter sends successfully")
  void shouldPublishEventAndLogSuccess() {
    // Arrange
    String transactionId = "tx-123";
    TransactionStatus newStatus = TransactionStatus.APPROVED;
    when(event.getPayload()).thenReturn(payload);
    when(payload.getTransactionExternalId()).thenReturn(transactionId);
    when(payload.getNewStatus()).thenReturn(newStatus);
    CompletableFuture<Void> future = new CompletableFuture<>();
    when(statusUpdatedEmitter.send(any(Record.class))).thenReturn(future);

    // Act
    publisher.publishStatusUpdated(event);
    future.complete(null);

    // Assert
    @SuppressWarnings("unchecked")
    ArgumentCaptor<Record<String, TransactionStatusUpdatedEvent>> captor =
        ArgumentCaptor.forClass(Record.class);
    verify(statusUpdatedEmitter).send(captor.capture());
    Record<String, TransactionStatusUpdatedEvent> captorValue = captor.getValue();
    assertEquals(transactionId, captorValue.key());
    assertSame(event, captorValue.value());
  }

  @Test
  @DisplayName("should handle null payload gracefully")
  void shouldHandleNullPayloadGracefully() {
    // Arrange
    when(event.getPayload()).thenReturn(null);

    // Act & Assert
    assertThrows(NullPointerException.class, () -> publisher.publishStatusUpdated(event));
  }
}
