package com.codeh.fraud_service.messaging.listener;

import com.codeh.fraud_service.config.FraudRulesConfig;
import com.codeh.fraud_service.messaging.event.TransactionCreatedEvent;
import com.codeh.fraud_service.messaging.event.TransactionValidatedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import static com.codeh.fraud_service.util.Constants.*;

@Component
@RequiredArgsConstructor
public class FraudListener {

    @Value("${kafka.topics.transaction-validated}")
    private String validatedTopic;

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final FraudRulesConfig rules;

    @KafkaListener(topics = "${kafka.topics.transaction-created}", groupId = "${spring.kafka.consumer.group-id}")
    public void onTransactionCreated(TransactionCreatedEvent event) {

        String status = event.value().compareTo(rules.getMaxAmount()) > ZERO ? STATUS_REJECTED : STATUS_APPROVED;

        TransactionValidatedEvent validated =
                new TransactionValidatedEvent(event.transactionExternalId(), status);

        kafkaTemplate.send(validatedTopic, event.transactionExternalId().toString(), validated);
    }

}
