package com.tec.yape.transaction.infrastructure.messaging.consumer;

import com.tec.yape.transaction.domain.model.TransactionValidatedEvent;
import com.tec.yape.transaction.domain.port.input.TransactionUpdateInPort;
import com.tec.yape.transaction.domain.util.JsonUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Headers;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.Map;

@Component
@Slf4j
@RequiredArgsConstructor
public class TransactionValidatedConsumer {

    private final TransactionUpdateInPort transactionUpdateInPort;

    @KafkaListener(topics = "topic-transaction-validated", groupId = "transaction-service-group")
    public void listener(String message, @Headers Map<String, Object> headers) {
        log.info("[TransactionValidatedConsumer] Event received: {}", message);

        String jsonMessage = new String(message.getBytes(), StandardCharsets.UTF_8);

        TransactionValidatedEvent event = JsonUtil.fromJson(jsonMessage, TransactionValidatedEvent.class);

        transactionUpdateInPort.updateTransactionStatus(event);
    }
}
