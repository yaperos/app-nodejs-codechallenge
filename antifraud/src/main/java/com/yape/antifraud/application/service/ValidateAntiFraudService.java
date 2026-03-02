package com.yape.antifraud.application.service;

import com.yape.antifraud.application.usecase.ValidateAntiFraudUseCase;
import com.yape.antifraud.domain.enums.TransactionStatus;
import com.yape.antifraud.domain.model.EventInbound;
import com.yape.antifraud.domain.model.EventOutbound;
import com.yape.antifraud.domain.ports.KafkaProducerPort;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class ValidateAntiFraudService implements ValidateAntiFraudUseCase {

    private static final BigDecimal FRAUD_THRESHOLD = new BigDecimal("1000");
    private static final Logger logger = LoggerFactory.getLogger(ValidateAntiFraudService.class);
    private final KafkaProducerPort kafkaProducerPort;

    @Override
    public Mono<Void> execute(EventInbound message) {
        return Mono.fromSupplier(() -> isFraudulent(message) ? TransactionStatus.REJECTED : TransactionStatus.APPROVED)
                .doOnNext(status -> logger.info("Transaction is {}", status == TransactionStatus.REJECTED ? "Fraudulent" : "Not Fraudulent"))
                .map(status -> EventOutbound.builder()
                        .id(message.getId())
                        .transactionExternalId(message.getTransactionExternalId())
                        .value(message.getValue())
                        .status(status.getValue())
                        .build())
                .flatMap(kafkaProducerPort::sendTransactionProcessed);
    }

    private boolean isFraudulent(EventInbound message) {
        return message.getValue().compareTo(FRAUD_THRESHOLD) > 0;
    }
}
