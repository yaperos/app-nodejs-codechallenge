package com.yape.antifraud.kafka.event;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.yape.antifraud.model.TransactionStatus;
import com.yape.antifraud.aplication.impl.FraudDetectionService;
import com.yape.antifraud.aplication.FraudDecisionService;
import com.yape.antifraud.kafka.models.TransactionReqEvent;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import static com.yape.antifraud.utils.Constants.TOPIC_CREATED;
import static com.yape.antifraud.utils.Constants.TOPIC_SERVICE_GROUP;

@Component
public class TransactionConsumer {

  private static final Logger log = LoggerFactory.getLogger(TransactionConsumer.class);
  private final FraudDecisionService fraudService;

  public TransactionConsumer(FraudDetectionService fraudService) {
    this.fraudService = fraudService;
  }

  @KafkaListener(topics = TOPIC_CREATED, groupId = TOPIC_SERVICE_GROUP)
  public void consume(TransactionReqEvent transaction) {

    fraudService.analyze(transaction);
    log.info("📦 [ANTI-FRAUD-SERVICE LISTENER] {} -> {} {}", transaction.getId(), transaction.getStatus(), transaction.getStatus() == TransactionStatus.APPROVED ? "✅" : transaction.getStatus() == TransactionStatus.REJECTED ? "❌" : "⏳");
  }
}
