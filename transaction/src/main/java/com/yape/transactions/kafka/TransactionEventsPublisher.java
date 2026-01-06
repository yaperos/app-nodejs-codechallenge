package com.yape.transactions.kafka;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class TransactionEventsPublisher {

  private final KafkaTemplate<String, TransactionCreatedEvent> kafkaTemplate;
  private final String createdTopic;

  public TransactionEventsPublisher(
      KafkaTemplate<String, TransactionCreatedEvent> kafkaTemplate,
      @Value("${app.topics.created}") String createdTopic
  ) {
    this.kafkaTemplate = kafkaTemplate;
    this.createdTopic = createdTopic;
  }

  public void publishCreated(TransactionCreatedEvent event) {
    kafkaTemplate.send(createdTopic, event.transactionExternalId(), event);
  }
}
