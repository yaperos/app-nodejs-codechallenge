package com.example.transactionservice.service;

import com.example.transactionservice.dto.TransactionStatusUpdatedEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.Disposable;
import reactor.core.publisher.Mono;
import reactor.kafka.receiver.KafkaReceiver;
import reactor.kafka.receiver.ReceiverRecord;

@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaConsumerService {
    
    private final KafkaReceiver<String, String> kafkaReceiver;
    private final ObjectMapper objectMapper;
    private final TransactionService transactionService;
    private Disposable disposable;
    
    @PostConstruct
    public void startConsuming() {
        log.info("Starting Kafka consumer for transaction status updates...");
        
        disposable = kafkaReceiver.receive()
            .flatMap(this::processMessage)
            .subscribe();
    }
    
    @PreDestroy
    public void stopConsuming() {
        if (disposable != null && !disposable.isDisposed()) {
            log.info("Stopping Kafka consumer...");
            disposable.dispose();
        }
    }
    
    private Mono<Void> processMessage(ReceiverRecord<String, String> record) {
        return Mono.fromCallable(() -> {
            log.info("Received message from Kafka: key={}, partition={}, offset={}",
                record.key(), record.partition(), record.offset());
            
            try {
                return objectMapper.readValue(
                    record.value(),
                    TransactionStatusUpdatedEvent.class
                );
            } catch (Exception e) {
                log.error("Error deserializing message: {}", e.getMessage(), e);
                throw new RuntimeException("Failed to deserialize message", e);
            }
        })
        .flatMap(event -> {
            log.info("Processing status update: transactionId={}, oldStatus={}, newStatus={}",
                event.getTransactionId(), event.getOldStatus(), event.getNewStatus());
            
            return transactionService.updateTransactionStatus(
                event.getTransactionId(),
                event.getNewStatus()
            );
        })
        .doOnSuccess(transaction -> {
            log.info("Successfully processed status update for transaction: {}",
                record.key());
            record.receiverOffset().acknowledge();
        })
        .doOnError(error -> {
            log.error("Error processing message for transaction: {}, error: {}",
                record.key(), error.getMessage(), error);
            // En producción, aquí podrías implementar lógica de retry o dead letter queue
            record.receiverOffset().acknowledge(); // Acknowledge para evitar reprocessamiento infinito
        })
        .onErrorResume(error -> Mono.empty())
        .then();
    }
}
