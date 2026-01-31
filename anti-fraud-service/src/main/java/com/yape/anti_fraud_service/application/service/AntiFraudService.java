package com.yape.anti_fraud_service.application.service;

import com.yape.anti_fraud_service.domain.model.Transaction;
import com.yape.anti_fraud_service.infrastructure.messaging.event.TransactionStatusUpdatedEvent;
import com.yape.anti_fraud_service.infrastructure.messaging.producer.KafkaProducer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

public interface AntiFraudService {
  Mono<Void> validateTransaction(Transaction transaction);
}
