package com.tec.yape.antifraud.infrastructure.messaging.consuper;

import com.tec.yape.antifraud.domain.port.input.FraudValidationInPort;
import com.tec.yape.antifraud.domain.util.JsonUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Headers;
import org.springframework.stereotype.Component;
import com.tec.yape.antifraud.domain.model.TransactionCreatedEvent;

import java.nio.charset.StandardCharsets;
import java.util.Map;

@Component
@Slf4j
@RequiredArgsConstructor
public class TransactionEventConsumer {

    private final FraudValidationInPort fraudValidationInPort;

    @KafkaListener(
            topics = "topic-transaction",
            groupId = "antifraud-service-group",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void listener(String message, @Headers Map<String, Object> headers) {

        String jsonMessage = new String(message.getBytes(), StandardCharsets.UTF_8);

        TransactionCreatedEvent event = JsonUtil.fromJson(jsonMessage, TransactionCreatedEvent.class);

        log.info("[AntifraudConsumer] Transaction received: {}", jsonMessage);
        log.info("[AntifraudConsumer] Client-id header: {}", headers.get("client-id"));

        fraudValidationInPort.validate(event);
    }
}
