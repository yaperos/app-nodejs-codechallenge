package com.devpull.antifraudservice.kafka;

import com.devpull.antifraudservice.dto.TransactionStatusChangedEvent;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

@Service
@Slf4j
public class EventProducer {

    private final KafkaTemplate<String, byte[]> kafkaTemplate;
    private final ObjectMapper objectMapper;
    private final String topicName;

    public EventProducer(KafkaTemplate<String, byte[]> kafkaTemplate,
                         NewTopic topic,
                         ObjectMapper objectMapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
        this.topicName = topic.name();
    }

    public void sendMessage(TransactionStatusChangedEvent event) {
        try {
            byte[] payload = objectMapper.writeValueAsBytes(event);
            kafkaTemplate.send(topicName, event.transactionId().toString(), payload);
            log.info("[ANTIFRAUD] Sent status event txId={}, status={}", event.transactionId(), event.status());
        } catch (Exception e) {
            log.error("[ANTIFRAUD] Failed to serialize/send event", e);
            throw new RuntimeException("Failed to produce event", e);
        }
    }

}
