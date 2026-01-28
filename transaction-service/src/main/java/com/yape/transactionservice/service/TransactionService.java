package com.yape.transactionservice.service;

import com.yape.transactionservice.dto.CreateTransactionRequest;
import com.yape.transactionservice.dto.TransactionCreatedEvent;
import com.yape.transactionservice.dto.TransactionResponse;
import com.yape.transactionservice.entity.Transaction;
import com.yape.transactionservice.entity.TransactionStatus;
import com.yape.transactionservice.entity.TransactionType;
import com.yape.transactionservice.kafka.TransactionProducer;
import com.yape.transactionservice.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final TransactionProducer transactionProducer;

    @Transactional
    public TransactionResponse createTransaction(CreateTransactionRequest request) {
        Transaction transaction = Transaction.builder()
                .accountExternalIdDebit(request.getAccountExternalIdDebit())
                .accountExternalIdCredit(request.getAccountExternalIdCredit())
                .transactionType(TransactionType.fromId(request.getTranferTypeId()))
                .value(request.getValue())
                .status(TransactionStatus.PENDING)
                .build();

        Transaction saved = transactionRepository.save(transaction);
        log.info("Transaction created with id: {}", saved.getId());

        TransactionCreatedEvent event = TransactionCreatedEvent.builder()
                .transactionId(saved.getId())
                .value(saved.getValue())
                .build();

        transactionProducer.sendTransactionCreatedEvent(event);

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public TransactionResponse getTransaction(UUID transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found: " + transactionId));

        return mapToResponse(transaction);
    }

    @Transactional
    public void updateTransactionStatus(UUID transactionId, TransactionStatus status) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found: " + transactionId));

        transaction.setStatus(status);
        transactionRepository.save(transaction);
        log.info("Transaction {} status updated to: {}", transactionId, status);
    }

    private TransactionResponse mapToResponse(Transaction transaction) {
        return TransactionResponse.builder()
                .transactionExternalId(transaction.getId())
                .transactionType(TransactionResponse.TransactionTypeDto.builder()
                        .name(transaction.getTransactionType().getName())
                        .build())
                .transactionStatus(TransactionResponse.TransactionStatusDto.builder()
                        .name(transaction.getStatus().name().toLowerCase())
                        .build())
                .value(transaction.getValue())
                .createdAt(transaction.getCreatedAt())
                .build();
    }
}
