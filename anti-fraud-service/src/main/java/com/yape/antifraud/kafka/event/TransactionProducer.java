package com.yape.antifraud.kafka.event;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.yape.antifraud.aplication.ProducerService;
import com.yape.antifraud.kafka.models.TransactionRespEvent;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import static com.yape.antifraud.utils.Constants.TOPIC_UPDATE;


@Component
public class TransactionProducer implements ProducerService {

  private static final Logger log = LoggerFactory.getLogger(TransactionProducer.class);
  private final KafkaTemplate<String, Object> kafkaTemplate;

  public TransactionProducer(KafkaTemplate<String, Object> kafkaTemplate) {
    this.kafkaTemplate = kafkaTemplate;
  }

  @Override
  public void sendMessage(TransactionRespEvent transaction) {

    kafkaTemplate.send(TOPIC_UPDATE, transaction);
    log.info("📦 [ANTI-FRAUD-SERVICE PRODUCER] {} -> {}", transaction.id(), transaction.status());
  }
}
