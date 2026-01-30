package com.yape.services.transaction.infrastructure.messaging;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import com.yape.services.transaction.application.usecase.ValidateTransactionUseCase;
import com.yape.services.transaction.events.TransactionCreatedEvent;
import io.smallrye.reactive.messaging.kafka.Record;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

/**
 * Unit tests for {@link KafkaTransactionCreatedConsumer}.
 */
@ExtendWith(MockitoExtension.class)
class KafkaTransactionCreatedConsumerTest {

  @Mock
  ValidateTransactionUseCase validateTransactionUseCase;

  @InjectMocks
  KafkaTransactionCreatedConsumer consumer;

  @Mock
  Record<String, TransactionCreatedEvent> kafkaRecord;

  @Mock
  TransactionCreatedEvent event;

  @Test
  @DisplayName("should delegate event to ValidateTransactionUseCase when event is received")
  void shouldDelegateEventToValidateTransactionUseCaseWhenEventIsReceived() {
    // Arrange
    when(kafkaRecord.key()).thenReturn("key-1");
    when(kafkaRecord.value()).thenReturn(event);

    // Act
    consumer.consume(kafkaRecord);

    // Assert
    org.mockito.Mockito.verify(validateTransactionUseCase, org.mockito.Mockito.times(1))
        .execute(event);
  }

  @Test
  @DisplayName("should log and rethrow exception if ValidateTransactionUseCase throws")
  void shouldLogAndRethrowExceptionIfValidateTransactionUseCaseThrows() {
    // Arrange
    when(kafkaRecord.key()).thenReturn("key-2");
    when(kafkaRecord.value()).thenReturn(event);
    RuntimeException ex = new RuntimeException("validation failed");
    org.mockito.Mockito.doThrow(ex).when(validateTransactionUseCase).execute(event);

    // Act & Assert
    assertEquals(
        ex,
        assertThrows(RuntimeException.class, () -> consumer.consume(kafkaRecord))
    );
  }

  @Test
  @DisplayName("should handle null event value gracefully")
  void shouldHandleNullEventValueGracefully() {
    // Arrange
    when(kafkaRecord.key()).thenReturn("key-3");
    when(kafkaRecord.value()).thenReturn(null);

    // Act
    consumer.consume(kafkaRecord);

    // Assert
    org.mockito.Mockito.verify(validateTransactionUseCase, org.mockito.Mockito.times(1))
        .execute(null);
  }
}
