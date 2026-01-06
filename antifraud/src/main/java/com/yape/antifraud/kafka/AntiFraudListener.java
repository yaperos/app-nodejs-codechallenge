package com.yape.antifraud.kafka;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class AntiFraudListener {

  private final StatusPublisher publisher;

  public AntiFraudListener(StatusPublisher publisher) {
    this.publisher = publisher;
  }

  @KafkaListener(topics = "${app.topics.created}", groupId = "antifraud-service")
  public void onCreated(TransactionCreatedEvent event) {
    String status = decide(event.value());
    publisher.publish(new TransactionStatusEvent(event.transactionExternalId(), status));
  }

  private String decide(BigDecimal value) {
    if (value == null) return "rejected";
    // Regla del reto: value > 1000 => rejected
    return value.compareTo(BigDecimal.valueOf(1000)) > 0 ? "rejected" : "approved";
  }
}
