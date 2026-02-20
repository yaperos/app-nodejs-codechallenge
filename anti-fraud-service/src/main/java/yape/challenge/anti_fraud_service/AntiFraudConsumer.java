package yape.challenge.anti_fraud_service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import yape.challenge.common.events.TransactionCreatedEvent;
import yape.challenge.common.events.TransactionStatusUpdatedEvent;

import java.time.Instant;

@Slf4j
@Component
public class AntiFraudConsumer {

    private final StatusUpdatedProducer producer;

    public AntiFraudConsumer(StatusUpdatedProducer producer) {
        this.producer = producer;
    }

    @KafkaListener(topics = "${app.kafka.topicCreated}")
    public void onCreated(TransactionCreatedEvent event) {
        TransactionStatusUpdatedEvent out = new TransactionStatusUpdatedEvent();
        out.transactionExternalId = event.transactionExternalId;
        out.updatedAt = Instant.now();

        log.info("[ANTI_FRAUD_CONSUME] txId={} value={}", event.transactionExternalId, event.value);

        if (event.value != null && event.value.doubleValue() > 1000.0) {
            out.status = "rejected";
            out.reason = "VALUE_LIMIT_EXCEEDED";
        } else {
            out.status = "approved";
            out.reason = "OK";
        }

        log.info("[ANTI_FRAUD_DECISION] txId={} status={}", event.transactionExternalId, out.status );

        producer.publish(out);
    }
}