package com.example.transactionservice.service;

import com.example.transactionservice.domain.Transaction;
import com.example.transactionservice.dto.CreateTransactionRequest;
import com.example.transactionservice.dto.TransactionCreatedEvent;
import com.example.transactionservice.dto.TransactionStatus;
import com.example.transactionservice.dto.TransactionType;
import com.example.transactionservice.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionService {
    
    private final TransactionRepository transactionRepository;
    private final KafkaProducerService kafkaProducerService;
    
    @Transactional
    public Mono<Transaction> createTransaction(CreateTransactionRequest request) {
        log.info("Creating new transaction: {}", request.getTransferTypeId());
        
        String transactionId = UUID.randomUUID().toString();
        
        Transaction transaction = Transaction.builder()
            .transactionId(transactionId)
            .accountExternalIdDebit(request.getAccountExternalIdDebit())
            .accountExternalIdCredit(request.getAccountExternalIdCredit())
            .transferTypeId(request.getTransferTypeId())
            .value(request.getValue())
            .status("PENDING")
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();
        
        return transactionRepository.save(transaction)
            .flatMap(savedTransaction -> {
                log.info("Transaction saved: {}", savedTransaction.getTransactionId());
                
                // Crear evento
                TransactionCreatedEvent event = TransactionCreatedEvent.builder()
                    .transactionId(savedTransaction.getTransactionId())
                    .transactionType(new TransactionType(String.valueOf(savedTransaction.getTransferTypeId())))
                    .transactionStatus(new TransactionStatus(savedTransaction.getStatus()))
                    .value(savedTransaction.getValue())
                    .createdAt(savedTransaction.getCreatedAt())
                    .build();
                
                // Publicar evento
                return kafkaProducerService.publishTransactionCreation(event)
                    .thenReturn(savedTransaction);
            })
            .doOnSuccess(tx -> log.info("Transaction created and event published: {}", tx.getTransactionId()))
            .doOnError(error -> log.error("Error creating transaction: {}", error.getMessage(), error));
    }
    
    public Mono<Transaction> getTransactionById(String transactionId) {
        log.info("Retrieving transaction: {}", transactionId);
        return transactionRepository.findByTransactionId(transactionId)
            .switchIfEmpty(Mono.error(new RuntimeException("Transaction not found: " + transactionId)));
    }

    public Flux<Transaction> getAllTransactions() {
        log.info("Retrieving all transactions");
        return transactionRepository.findAll()
                .switchIfEmpty(Flux.just());
    }

    @Transactional
    public Mono<Transaction> updateTransactionStatus(String transactionId, String newStatus) {
        log.info("Updating transaction status: transactionId={}, newStatus={}", transactionId, newStatus);
        
        return transactionRepository.findByTransactionId(transactionId)
            .switchIfEmpty(Mono.error(new RuntimeException("Transaction not found: " + transactionId)))
            .flatMap(transaction -> {
                transaction.setStatus(newStatus);
                transaction.setUpdatedAt(LocalDateTime.now());
                return transactionRepository.save(transaction);
            })
            .doOnSuccess(tx -> log.info("Transaction status updated: transactionId={}, status={}",
                tx.getTransactionId(), tx.getStatus()))
            .doOnError(error -> log.error("Error updating transaction status: {}", error.getMessage(), error));
    }
}
