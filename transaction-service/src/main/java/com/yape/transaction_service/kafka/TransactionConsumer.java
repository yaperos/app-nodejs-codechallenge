package com.yape.transaction_service.kafka;

import com.yape.transaction_service.dto.TransactionEventDto;
import com.yape.transaction_service.model.TransactionStatus;
import com.yape.transaction_service.service.TransactionService;
import com.yape.transaction_service.service.TransactionStatusService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class TransactionConsumer {

    private final TransactionService transactionService;
    private final TransactionStatusService transactionStatusService;

    @KafkaListener(topics = "transaction.status", groupId = "transaction-group")
    public void onTransactionStatus(TransactionEventDto event) {
        log.info("Recibido evento de antifraude: {}", event);
        transactionService.findById( event.getTransactionId() )
                .ifPresent(transaction -> {
                    TransactionStatus transactionStatus =
                            transactionStatusService.findById( event.getTransactionStatusId() ).orElseThrow(
                                () -> new RuntimeException("Error al recuperar la Transacion Status")
                            );
                    transaction.setStatus(transactionStatus);
                    transactionService.save(transaction);
                    log.info("Transacción {} actualizada a {}", event.getTransactionId(), event.getTransactionStatusId());
                });
    }
}