package com.yape.transaction.infrastructure.adapter.out.kafka;

import com.yape.transaction.domain.event.TransactionCreatedEvent;
import com.yape.transaction.domain.port.out.TransactionEventPublisher;
import com.yape.transaction.infrastructure.config.KafkaTopics;
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
public class KafkaTransactionEventPublisher implements TransactionEventPublisher {

    private static final Logger log = LoggerFactory.getLogger(KafkaTransactionEventPublisher.class);
    private static final String TOPIC = KafkaTopics.TRANSACTION_CREATED;
    private static final String CORRELATION_HEADER = "X-Correlation-ID";
    private static final int SEND_TIMEOUT_SECONDS = 10;

    private final KafkaTemplate<String, TransactionCreatedMessage> kafkaTemplate;

    public KafkaTransactionEventPublisher(KafkaTemplate<String, TransactionCreatedMessage> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @Override
    public void publishTransactionCreated(TransactionCreatedEvent event) {
        var message = new TransactionCreatedMessage(event.transactionId(), event.value());
        var record = new ProducerRecord<>(TOPIC, null, event.transactionId().toString(), message);

        String correlationId = MDC.get("correlationId");
        if (correlationId != null) {
            record.headers().add(CORRELATION_HEADER, correlationId.getBytes(StandardCharsets.UTF_8));
        }

        try {
            var result = kafkaTemplate.send(record).get(SEND_TIMEOUT_SECONDS, TimeUnit.SECONDS);
            log.info("event=kafka.message_sent, topic={}, transactionId={}, partition={}, offset={}, outcome=success",
                    TOPIC, event.transactionId(),
                    result.getRecordMetadata().partition(),
                    result.getRecordMetadata().offset());
        } catch (ExecutionException | TimeoutException | InterruptedException ex) {
            log.error("event=kafka.send_failed, topic={}, transactionId={}, outcome=failure, error={}",
                    TOPIC, event.transactionId(), ex.getMessage(), ex);
            if (ex instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            throw new RuntimeException("Failed to publish transaction event to Kafka", ex);
        }
    }
}
