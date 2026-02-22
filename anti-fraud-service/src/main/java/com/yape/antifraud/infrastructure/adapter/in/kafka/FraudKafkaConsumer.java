package com.yape.antifraud.infrastructure.adapter.in.kafka;

import com.yape.antifraud.domain.port.in.EvaluateFraudCommand;
import com.yape.antifraud.domain.port.in.EvaluateFraudUseCase;
import com.yape.antifraud.infrastructure.config.KafkaGroups;
import com.yape.antifraud.infrastructure.config.KafkaTopics;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.common.header.Header;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.UUID;

@Component
public class FraudKafkaConsumer {

    private static final Logger log = LoggerFactory.getLogger(FraudKafkaConsumer.class);
    private static final String CORRELATION_HEADER = "X-Correlation-ID";

    private final EvaluateFraudUseCase evaluateFraudUseCase;

    public FraudKafkaConsumer(EvaluateFraudUseCase evaluateFraudUseCase) {
        this.evaluateFraudUseCase = evaluateFraudUseCase;
    }

    @KafkaListener(
            topics = KafkaTopics.TRANSACTION_CREATED,
            groupId = KafkaGroups.TRANSACTION_CREATED
    )
    public void consume(ConsumerRecord<String, TransactionCreatedMessage> record) {
        try {
            String correlationId = extractCorrelationId(record);
            MDC.put("correlationId", correlationId);
            MDC.put("service", "anti-fraud-service");

            TransactionCreatedMessage message = record.value();
            log.info("event=kafka.message_received, topic={}, transactionId={}, value={}",
                    record.topic(), message.transactionId(), message.value());
            try {
                var command = new EvaluateFraudCommand(
                        message.transactionId(),
                        message.value()
                );
                evaluateFraudUseCase.execute(command);
            } catch (Exception ex) {
                log.error("event=kafka.message_processing_failed, topic={}, transactionId={}, outcome=failure, error={}",
                        record.topic(), message.transactionId(), ex.getMessage(), ex);
                throw ex;
            }
        } finally {
            MDC.clear();
        }
    }

    private String extractCorrelationId(ConsumerRecord<String, TransactionCreatedMessage> record) {
        Header header = record.headers().lastHeader(CORRELATION_HEADER);
        if (header != null && header.value() != null) {
            return new String(header.value(), StandardCharsets.UTF_8);
        }
        return UUID.randomUUID().toString();
    }
}
