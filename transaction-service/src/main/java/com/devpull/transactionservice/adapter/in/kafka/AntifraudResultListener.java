package com.devpull.transactionservice.adapter.in.kafka;

import com.devpull.transactionservice.adapter.in.web.dto.kafka.TransactionStatusChangedEvent;
import com.devpull.transactionservice.application.port.in.UpdateTransactionStatusUseCase;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

@Component
@RequiredArgsConstructor
@Slf4j
public class AntifraudResultListener {

    private final ObjectMapper objectMapper;
    private final UpdateTransactionStatusUseCase useCase;

    @KafkaListener(topics = "${spring.kafka.topic.name}", groupId = "${spring.kafka.consumer.group-id}")
    public void consume(byte[] payload) {
        try{
            TransactionStatusChangedEvent event =
                    objectMapper.readValue(payload, TransactionStatusChangedEvent.class);

            log.info("Received antifraud event txId={}, status={}",
                    event.transactionId(), event.status());

            useCase.updateStatus(event.transactionId(), event.status())
                    .doOnError(e -> log.error("Failed updating tx {}", event.transactionId(), e))
                    .subscribe();

        } catch (Exception e) {
            log.error("Failed to deserialize antifraud payload", e);
        }

    }
}
