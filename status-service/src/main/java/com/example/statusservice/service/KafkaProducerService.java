package com.example.statusservice.service;

import com.example.statusservice.config.KafkaTopicConfig;
import com.example.statusservice.dto.TransactionStatusUpdatedEvent;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.kafka.sender.KafkaSender;
import reactor.kafka.sender.SenderRecord;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaProducerService {
    
    private final KafkaSender<String, String> kafkaSender;
    private final KafkaTopicConfig topicConfig;
    private final ObjectMapper objectMapper;
    
    public Mono<Void> publishStatusUpdated(TransactionStatusUpdatedEvent event) {
        return Mono.fromCallable(() -> {
            // Generar IDs de evento si no existen
            if (event.getEventId() == null) {
                event.setEventId(UUID.randomUUID().toString());
            }
            if (event.getEventTimestamp() == null) {
                event.setEventTimestamp(LocalDateTime.now());
            }
            
            try {
                return objectMapper.writeValueAsString(event);
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Error serializing event", e);
            }
        })
        .flatMap(eventJson -> {
            ProducerRecord<String, String> producerRecord = new ProducerRecord<>(
                topicConfig.getAntiFraudValidation(),
                event.getTransactionId(),
                eventJson
            );
            
            SenderRecord<String, String, String> senderRecord = SenderRecord.create(
                producerRecord,
                event.getTransactionId()
            );
            
            return kafkaSender.send(Mono.just(senderRecord))
                .next()
                .doOnSuccess(result -> {
                    log.info("Successfully published status update event: transactionId={}, partition={}, offset={}",
                        event.getTransactionId(),
                        result.recordMetadata().partition(),
                        result.recordMetadata().offset());
                })
                .doOnError(error -> {
                    log.error("Error publishing status update event: transactionId={}, error={}",
                        event.getTransactionId(), error.getMessage(), error);
                })
                .then();
        })
        .onErrorResume(error -> {
            log.error("Failed to publish status update event", error);
            return Mono.error(new RuntimeException("Failed to publish event", error));
        });
    }
}
