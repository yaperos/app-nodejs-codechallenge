package com.tec.yape.antifraud.infrastructure.messaging.producer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.tec.yape.antifraud.domain.model.TransactionValidatedEvent;
import com.tec.yape.antifraud.domain.util.JsonUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@Slf4j
public class TransactionStatusPublisherImpl implements TransactionStatusPublisher {

    private final KafkaTemplate<String, String> kafkaTemplate;

    public TransactionStatusPublisherImpl(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @Override
    public void publish(TransactionValidatedEvent event) {
        log.info("[TransactionStatusPublisherImpl] {}", "Start async process");

        try {
            String message = JsonUtil.ToJSON(event);

            Message<String> kafkaMessage = MessageBuilder
                    .withPayload(message)
                    .setHeader(KafkaHeaders.TOPIC, "topic-transaction-validated")
                    .copyHeaders(getHeaders())
                    .build();

            kafkaTemplate.send(kafkaMessage);

        } catch (JsonProcessingException e) {
            log.error("[TransactionStatusPublisherImpl] message:{}", e.getMessage());
        }
    }

    private Map<String, String> getHeaders() {
        Map<String, String> headers = new HashMap<>();
        headers.put("client-id", "EVER CARLOS ROJAS");
        return headers;
    }

}
