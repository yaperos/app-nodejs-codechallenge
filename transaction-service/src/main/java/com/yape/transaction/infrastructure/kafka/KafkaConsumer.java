package com.yape.transaction.infrastructure.kafka;

import com.yape.transaction.domain.model.TransactionStatus;
import com.yape.transaction.infrastructure.kafka.events.TransactionUpdatedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.kafka.annotation.KafkaListener;
import com.yape.transaction.application.port.in.UpdateTransactionUseCase;

import static com.yape.transaction.application.utils.Constants.TOPIC_UPDATE;
import static com.yape.transaction.application.utils.Constants.TOPIC_SERVICE_GROUP;

@Component
public class KafkaConsumer {

  private static final Logger log = LoggerFactory.getLogger(KafkaConsumer.class);
  private final UpdateTransactionUseCase useCase;

  public KafkaConsumer(UpdateTransactionUseCase useCase) {
    this.useCase = useCase;
  }

  @KafkaListener(topics = TOPIC_UPDATE, groupId = TOPIC_SERVICE_GROUP)
  public void consume(TransactionUpdatedEvent event) {

    useCase.updateStatus(event.id(), event.status());
    log.info("📦 [TRANSACTION-SERVICE LISTENER] {} -> {} {}", event.id(), event.status(), event.status() == TransactionStatus.APPROVED ? "✅" : event.status() == TransactionStatus.REJECTED ? "❌" : "⏳");
  }
}
