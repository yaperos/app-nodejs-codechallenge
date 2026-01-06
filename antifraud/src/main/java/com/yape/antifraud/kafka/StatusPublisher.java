package com.yape.antifraud.kafka;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class StatusPublisher {

  private final KafkaTemplate<String, TransactionStatusEvent> kafkaTemplate;
  private final String statusTopic;

  public StatusPublisher(
      KafkaTemplate<String, TransactionStatusEvent> kafkaTemplate,
      @Value("${app.topics.status}") String statusTopic
  ) {
    this.kafkaTemplate = kafkaTemplate;
    this.statusTopic = statusTopic;
  }

  public void publish(TransactionStatusEvent event) {
    kafkaTemplate.send(statusTopic, event.transactionExternalId(), event);
  }
}
