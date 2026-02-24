package pe.yape.transactions.infrastructure.kafka.producer;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import pe.yape.transactions.domain.event.TransactionCreatedEvent;

@Component
public class TransactionEventPublisher {

    public static final String TOPIC = "transactions.created";

    private final KafkaTemplate<String, TransactionCreatedEvent> kafkaTemplate;

    public TransactionEventPublisher(KafkaTemplate<String, TransactionCreatedEvent> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void publish(TransactionCreatedEvent event){
        kafkaTemplate.send(TOPIC, event.transactionExternalId().toString(), event);
    }
}