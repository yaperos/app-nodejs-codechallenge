package com.example.statusservice.service;

import com.example.statusservice.dto.TransactionCreatedEvent;
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

import java.time.Duration;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaConsumerService {
    
    private final KafkaReceiver<String, String> kafkaReceiver;
    private final ObjectMapper objectMapper;
    private final StatusService statusService;
    private final Random random = new Random();
    private Disposable disposable;
    
    @PostConstruct
    public void startConsuming() {
        log.info("Starting Kafka consumer for transaction created events...");
        
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
            log.info("Received transaction created event: key={}, partition={}, offset={}",
                record.key(), record.partition(), record.offset());
            
            try {
                return objectMapper.readValue(
                    record.value(),
                    TransactionCreatedEvent.class
                );
            } catch (Exception e) {
                log.error("Error deserializing message: {}", e.getMessage(), e);
                throw new RuntimeException("Failed to deserialize message", e);
            }
        })
        .flatMap(event -> {
            log.info("Processing transaction: transactionId={}, amount={}",
                event.getTransactionId(), event.getValue());
            
            // Simular procesamiento de la transacción
            return processTransaction(event);
        })
        .doOnSuccess(result -> {
            log.info("Successfully processed transaction: {}", record.key());
            record.receiverOffset().acknowledge();
        })
        .doOnError(error -> {
            log.error("Error processing message for transaction: {}, error: {}",
                record.key(), error.getMessage(), error);
            record.receiverOffset().acknowledge();
        })
        .onErrorResume(error -> Mono.empty())
        .then();
    }
    
    private Mono<Void> processTransaction(TransactionCreatedEvent event) {
        // Simular el procesamiento asíncrono de la transacción
        return Mono.delay(Duration.ofSeconds(2))
            .flatMap(delay -> {
                
                log.info("Transaction processed: transactionId={}",
                    event.getTransactionId());
                
                // Actualizar el estado
                return statusService.validateTransactionStatus(
                    event.getTransactionId(),
                    event.getTransactionStatus().getName(),
                    "status-service",
                    event.getValue()
                );
            });
    }
}
