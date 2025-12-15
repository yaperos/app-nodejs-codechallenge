package com.transaction.app.infrastructure.kafka.producer;

import com.transaction.app.domain.model.TransactionModel;
import com.transaction.app.domain.port.out.TransactionEventPublisherPort;
import com.transaction.app.infrastructure.kafka.event.TransactionCreatedEvent;
import lombok.AllArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class TransactionCreatedProducer
        implements TransactionEventPublisherPort {

    private final KafkaTemplate<String, TransactionCreatedEvent> kafkaTemplate;

    @Override
    public void publish(TransactionModel model) {
        kafkaTemplate.send(
                "transaction-created",
                model.getTransactionExternalId().toString(),
                new TransactionCreatedEvent(
                        model.getTransactionExternalId(),
                        model.getValue()
                )
        );
    }
}
