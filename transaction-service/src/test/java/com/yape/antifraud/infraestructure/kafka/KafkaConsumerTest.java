package com.yape.antifraud.infraestructure.kafka;

import java.util.UUID;
import com.yape.transaction.application.port.in.UpdateTransactionUseCase;
import com.yape.transaction.domain.model.TransactionStatus;
import com.yape.transaction.infrastructure.kafka.KafkaConsumer;
import com.yape.transaction.infrastructure.kafka.events.TransactionUpdatedEvent;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.mockito.Mockito.*;

class KafkaConsumerTest {

  private UpdateTransactionUseCase useCase;
  private KafkaConsumer consumer;

  @BeforeEach
  void setup() {
    useCase = mock(UpdateTransactionUseCase.class);
    consumer = new KafkaConsumer(useCase);
  }

  @Test
  void consume_CallUpdateStatus() {
    UUID id = UUID.randomUUID();
    TransactionUpdatedEvent event = new TransactionUpdatedEvent(id, TransactionStatus.APPROVED);

    consumer.consume(event);

    verify(useCase, times(1))
      .updateStatus(id, TransactionStatus.APPROVED);
  }
}
