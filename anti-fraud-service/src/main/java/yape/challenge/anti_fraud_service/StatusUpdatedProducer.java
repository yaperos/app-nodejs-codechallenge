package yape.challenge.anti_fraud_service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import yape.challenge.common.events.TransactionStatusUpdatedEvent;

@Slf4j
@Component
public class StatusUpdatedProducer {

    private final KafkaTemplate<String, Object> template;
    private final String topic;

    public StatusUpdatedProducer(KafkaTemplate<String, Object> template,
                                 @Value("${app.kafka.topicStatusUpdated}") String topic) {
        this.template = template;
        this.topic = topic;
    }

    public void publish(TransactionStatusUpdatedEvent event) {
        log.info("[STATUS_PUBLISH] txId={} status={}", event.transactionExternalId, event.status);
        template.send(topic, event.transactionExternalId, event);
    }
}