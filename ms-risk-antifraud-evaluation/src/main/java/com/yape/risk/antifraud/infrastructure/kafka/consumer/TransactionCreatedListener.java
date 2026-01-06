package com.yape.risk.antifraud.infrastructure.kafka.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yape.risk.antifraud.application.AntifraudEvaluationService;
import com.yape.risk.antifraud.infrastructure.kafka.KafkaTopics;
import com.yape.risk.antifraud.infrastructure.kafka.dto.TransactionCreatedEvent;
import com.yape.risk.antifraud.infrastructure.kafka.producer.TransactionValidatedProducer;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class TransactionCreatedListener {

    private final ObjectMapper objectMapper;
    private final AntifraudEvaluationService antifraudService;
    private final TransactionValidatedProducer producer;

    public TransactionCreatedListener(ObjectMapper objectMapper,
                                      AntifraudEvaluationService antifraudService,
                                      TransactionValidatedProducer producer) {
        this.objectMapper = objectMapper;
        this.antifraudService = antifraudService;
        this.producer = producer;
    }

    @KafkaListener(
            topics = KafkaTopics.PAYMENT_TRANSACTION_CREATED_V1,
            groupId = "ms-risk-antifraud-evaluation"
    )
    public void onMessage(String message) throws Exception {

        TransactionCreatedEvent event =
                objectMapper.readValue(message, TransactionCreatedEvent.class);

        var result = antifraudService.evaluate(event);

        producer.publish(result);
    }
}
