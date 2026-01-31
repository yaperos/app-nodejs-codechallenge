package com.yape.anti_fraud_service.application.service.impl;

import com.yape.anti_fraud_service.application.service.AntiFraudService;
import com.yape.anti_fraud_service.domain.model.Transaction;
import com.yape.anti_fraud_service.domain.model.repository.TransactionsRepository;
import com.yape.anti_fraud_service.infrastructure.messaging.event.TransactionStatusUpdatedEvent;
import com.yape.anti_fraud_service.infrastructure.messaging.producer.KafkaProducer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;


@Slf4j
@Service
@RequiredArgsConstructor
public class AntiFraudServiceImpl implements AntiFraudService {

    private final KafkaProducer kafkaProducer;
    private final TransactionsRepository transactionsRepository;

    @Override
    public Mono<Void> validateTransaction(Transaction transaction) {

        return transactionsRepository.findByTransactionExternalId(transaction.getTransactionExternalId())
                .switchIfEmpty(Mono.error(new IllegalStateException("Transaction not found")))
                .flatMap(transaction_ -> {

                    String status = (transaction_.getValue().compareTo(BigDecimal.valueOf(1000)) > 0)
                            ? "REJECTED"
                            : "APPROVED";

                    TransactionStatusUpdatedEvent event =
                            TransactionStatusUpdatedEvent.builder()
                                    .transactionExternalId(transaction_.getTransactionExternalId())
                                    .status(status)
                                    .build();

                    return kafkaProducer.sendTransactionStatusUpdated(event)
                            .then(); // Converts Mono<Object> to Mono<Void>
                });
    }
}
