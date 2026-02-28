package com.example.statusservice.service;

import com.example.statusservice.dto.TransactionStatusUpdatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class StatusService {

    private final KafkaProducerService kafkaProducerService;

    public Mono<Void> validateTransactionStatus(
            String transactionId,
            String oldStatus,
            String updatedBy,
            BigDecimal amount) {


        // Crear evento
        TransactionStatusUpdatedEvent event = TransactionStatusUpdatedEvent.builder()
                .transactionId(transactionId)
                .oldStatus(oldStatus)
                .newStatus(amount.compareTo(BigDecimal.valueOf(999))>0 ? "REJECTED":"ACCEPTED")
                .updatedBy(updatedBy)
                .updatedAt(LocalDateTime.now())
                .build();

        // Publicar evento
        return kafkaProducerService.publishStatusUpdated(event)
                .doOnSuccess(v -> log.info("Status update event published for transaction: {}", transactionId));
    }
}
