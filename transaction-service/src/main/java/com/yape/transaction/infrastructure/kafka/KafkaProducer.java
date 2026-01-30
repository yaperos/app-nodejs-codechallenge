package com.yape.transaction.infrastructure.kafka;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.yape.transaction.application.port.out.TransactionEventPublisher;
import com.yape.transaction.domain.model.Transaction;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import static com.yape.transaction.application.utils.Constants.TOPIC_CREATED;

@Service
public class KafkaProducer implements TransactionEventPublisher {

  private static final Logger log = LoggerFactory.getLogger(KafkaProducer.class);
  private final KafkaTemplate<String, Transaction> kafkaTemplate;

  public KafkaProducer(KafkaTemplate<String, Transaction> kafkaTemplate) {
    this.kafkaTemplate = kafkaTemplate;
  }

  @Override
  public void publish(Transaction transaction) {

    kafkaTemplate.send(TOPIC_CREATED, transaction);
    log.info("📦 [TRANSACTION-SERVICE PRODUCER] {} -> {}", transaction.getId(), transaction.getStatus());
  }
}