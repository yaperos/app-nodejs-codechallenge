package com.tec.yape.transaction.infrastructure.messaging.producer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.tec.yape.transaction.domain.model.TransactionCreatedEvent;
import com.tec.yape.transaction.domain.util.JsonUtil;
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
public class TransactionEventPublisherImpl implements TransactionEventPublisher {

    private final KafkaTemplate<String, String> kafkaTemplate;

    public TransactionEventPublisherImpl(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @Override
    public void publish(TransactionCreatedEvent event) {
        log.info("[TransactionEventPublisherImpl] {}", "Start async process");

        try {
            String message = JsonUtil.ToJSON(event);

            Message<String> kafkaMessage = MessageBuilder
                    .withPayload(message)
                    .setHeader(KafkaHeaders.TOPIC, "topic-transaction")
                    .copyHeaders(getHeaders())
                    .build();

            kafkaTemplate.send(kafkaMessage);

        } catch (JsonProcessingException e) {
            log.error("[TransactionEventPublisherImpl] message:{}", e.getMessage());
        }
    }

    private Map<String, String> getHeaders() {
        Map<String, String> headers = new HashMap<>();
        headers.put("client-id", "EVER CARLOS ROJAS");
        return headers;
    }

}
