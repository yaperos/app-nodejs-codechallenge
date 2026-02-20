package yape.challenge.transaction_service.adapters.messaging;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import yape.challenge.common.events.TransactionCreatedEvent;

@Slf4j
@Component
public class KafkaTransactionProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final String topicCreated;

    public KafkaTransactionProducer(
            KafkaTemplate<String, Object> kafkaTemplate,
            @Value("${app.kafka.topicCreated}") String topicCreated) {
        this.kafkaTemplate = kafkaTemplate;
        this.topicCreated = topicCreated;
    }

    public void publishCreated(TransactionCreatedEvent event) {
        log.info("[TX_CREATED_PUBLISH] txId={} value={}", event.transactionExternalId, event.value);

        kafkaTemplate.send(topicCreated, event.transactionExternalId, event);
    }
}