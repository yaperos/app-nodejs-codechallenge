package com.yape.services.transaction.infrastructure.messaging;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.yape.services.common.events.EventMetadata;
import com.yape.services.transaction.events.TransactionCreatedEvent;
import com.yape.services.transaction.events.TransactionCreatedPayload;
import com.yape.services.transaction.events.enums.TransactionStatus;
import io.smallrye.reactive.messaging.kafka.Record;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import org.eclipse.microprofile.reactive.messaging.Emitter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class KafkaTransactionEventPublisherTest {

  @Mock
  private Emitter<Record<String, TransactionCreatedEvent>> emitter;

  private KafkaTransactionEventPublisher publisher;

  private static final UUID TRANSACTION_EXTERNAL_ID = UUID.randomUUID();

  @BeforeEach
  void setUp() {
    publisher = new KafkaTransactionEventPublisher(emitter);
  }

  @Test
  @DisplayName("should send event to Kafka with transaction external ID as key")
  void shouldSendEventToKafkaWithCorrectKey() {
    // Arrange
    TransactionCreatedEvent event = createEvent();
    CompletableFuture<Void> future = CompletableFuture.completedFuture(null);

    when(emitter.send(argThat((Record<String, TransactionCreatedEvent> eventRecord) ->
        eventRecord != null && eventRecord.key().equals(TRANSACTION_EXTERNAL_ID.toString())
    ))).thenReturn(future);

    // Act
    publisher.publishTransactionCreated(event);

    // Assert
    verify(emitter).send(argThat((Record<String, TransactionCreatedEvent> eventRecord) ->
        eventRecord.key().equals(TRANSACTION_EXTERNAL_ID.toString())
            && eventRecord.value().equals(event)
    ));
  }

  @Test
  @DisplayName("should send event with correct payload")
  void shouldSendEventWithCorrectPayload() {
    // Arrange
    TransactionCreatedEvent event = createEvent();
    CompletableFuture<Void> future = CompletableFuture.completedFuture(null);

    when(emitter.send((Record<String, TransactionCreatedEvent>) argThat(Objects::nonNull)))
        .thenReturn(future);

    // Act
    publisher.publishTransactionCreated(event);

    // Assert
    verify(emitter).send(argThat((Record<String, TransactionCreatedEvent> eventRecord) -> {
      TransactionCreatedEvent sentEvent = eventRecord.value();
      assertEquals(TRANSACTION_EXTERNAL_ID.toString(),
          sentEvent.getPayload().getTransactionExternalId());
      assertEquals(TransactionStatus.PENDING, sentEvent.getPayload().getStatus());
      return true;
    }));
  }

  @Test
  @DisplayName("should handle failed send gracefully")
  void shouldHandleFailedSendGracefully() {
    // Arrange
    TransactionCreatedEvent event = createEvent();
    CompletableFuture<Void> failedFuture = new CompletableFuture<>();
    failedFuture.completeExceptionally(new RuntimeException("Kafka unavailable"));

    when(emitter.send((Record<String, TransactionCreatedEvent>) argThat(Objects::nonNull)))
        .thenReturn(failedFuture);

    // Act
    publisher.publishTransactionCreated(event);

    // Assert
    verify(emitter).send((Record<String, TransactionCreatedEvent>) argThat(Objects::nonNull));
  }

  private TransactionCreatedEvent createEvent() {
    EventMetadata metadata = EventMetadata.newBuilder()
        .setEventId(UUID.randomUUID().toString())
        .setEventType("TRANSACTION_CREATED")
        .setEventTimestamp("2024-01-01T00:00:00.000+0000")
        .setSource("ms-transaction")
        .setVersion("1.0.0")
        .setRequestId("request-123")
        .build();

    TransactionCreatedPayload payload = TransactionCreatedPayload.newBuilder()
        .setTransactionExternalId(TRANSACTION_EXTERNAL_ID.toString())
        .setAccountExternalIdDebit(UUID.randomUUID().toString())
        .setAccountExternalIdCredit(UUID.randomUUID().toString())
        .setTransferTypeId(1)
        .setValue("100.00")
        .setStatus(TransactionStatus.PENDING)
        .setCreatedAt("2024-01-01T00:00:00.000+0000")
        .build();

    return TransactionCreatedEvent.newBuilder()
        .setMetadata(metadata)
        .setPayload(payload)
        .build();
  }
}
