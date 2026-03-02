package com.yape.transaction_service.kafka;

import com.yape.transaction_service.dto.TransactionEventDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TransactionProducer {

    private final KafkaTemplate<String, TransactionEventDto> kafkaTemplate;

    public void sendTransactionCreated(TransactionEventDto event) {
        log.info("Publicando evento en transaction.created: {}", event);
        kafkaTemplate.send("transaction.created", event.getTransactionId().toString() , event);
    }
}