package com.yape.antifraud.infrastructure.adapter.out.kafka;

import com.yape.antifraud.domain.model.FraudEvaluation;
import com.yape.antifraud.domain.port.out.FraudResultPublisher;
import com.yape.antifraud.infrastructure.config.KafkaTopics;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

@Component
public class KafkaFraudResultPublisher implements FraudResultPublisher {

    private static final Logger log = LoggerFactory.getLogger(KafkaFraudResultPublisher.class);
    private static final String TOPIC = KafkaTopics.TRANSACTION_STATUS_UPDATED;
    private static final String CORRELATION_HEADER = "X-Correlation-ID";
    private static final int SEND_TIMEOUT_SECONDS = 10;

    private final KafkaTemplate<String, TransactionStatusMessage> kafkaTemplate;

    public KafkaFraudResultPublisher(KafkaTemplate<String, TransactionStatusMessage> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @Override
    public void publishResult(FraudEvaluation evaluation) {
        var message = new TransactionStatusMessage(
                evaluation.transactionId(),
                evaluation.status()
        );
        var record = new ProducerRecord<>(TOPIC, null, evaluation.transactionId().toString(), message);

        String correlationId = MDC.get("correlationId");
        if (correlationId != null) {
            record.headers().add(CORRELATION_HEADER, correlationId.getBytes(StandardCharsets.UTF_8));
        }

        try {
            var result = kafkaTemplate.send(record).get(SEND_TIMEOUT_SECONDS, TimeUnit.SECONDS);
            log.info("event=kafka.message_sent, topic={}, transactionId={}, status={}, partition={}, outcome=success",
                    TOPIC, evaluation.transactionId(),
                    evaluation.status(),
                    result.getRecordMetadata().partition());
        } catch (ExecutionException | TimeoutException | InterruptedException ex) {
            log.error("event=kafka.send_failed, topic={}, transactionId={}, outcome=failure, error={}",
                    TOPIC, evaluation.transactionId(), ex.getMessage(), ex);
            if (ex instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            throw new RuntimeException("Failed to publish fraud result to Kafka", ex);
        }
    }
}
