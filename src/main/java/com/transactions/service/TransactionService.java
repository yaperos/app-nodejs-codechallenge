package com.transactions.service;

import com.transactions.model.Transaction;
import com.transactions.model.dto.CreateTransactionRequest;
import com.transactions.model.dto.TransactionResponse;
import com.transactions.model.enums.TransactionStatus;
import com.transactions.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionService {

  private final TransactionRepository transactionRepository;
  private final KafkaTemplate<String, Object> kafkaTemplate;

  @Transactional
  public TransactionResponse createTransaction(CreateTransactionRequest request) {
    log.info("Creating transaction with value: {}", request.getValue());

    Transaction transaction = new Transaction();
    transaction.setAccountExternalIdDebit(request.getAccountExternalIdDebit());
    transaction.setAccountExternalIdCredit(request.getAccountExternalIdCredit());
    transaction.setTransferTypeId(request.getTransferTypeId());
    transaction.setTransactionValue(request.getValue());
    transaction.setStatus(TransactionStatus.PENDING);

    Transaction savedTransaction = transactionRepository.save(transaction);

    // Enviar evento a Kafka para validación antifraude
    kafkaTemplate.send("transaction.created", Map.of(
      "transactionExternalId", savedTransaction.getTransactionExternalId(),
      "value", savedTransaction.getTransactionValue(),
      "timestamp", java.time.Instant.now()
    ));

    log.info("Transaction created: {}", savedTransaction.getTransactionExternalId());

    return mapToResponse(savedTransaction);
  }

  public TransactionResponse getTransaction(UUID transactionExternalId) {
    Transaction transaction = transactionRepository.findByTransactionExternalId(transactionExternalId)
      .orElseThrow(() -> new RuntimeException("Transaction not found"));

    return mapToResponse(transaction);
  }

  public List<TransactionResponse> getAllTransactions() {
    return transactionRepository.findAll().stream()
      .map(this::mapToResponse)
      .collect(Collectors.toList());
  }

  @Transactional
  public void updateTransactionStatus(UUID transactionExternalId, TransactionStatus status, String rejectionReason) {
    transactionRepository.findByTransactionExternalId(transactionExternalId)
      .ifPresent(transaction -> {
        transaction.setStatus(status);
        transaction.setRejectionReason(rejectionReason);
        transactionRepository.save(transaction);
        log.info("Transaction {} updated to {}", transactionExternalId, status);
      });
  }

  private TransactionResponse mapToResponse(Transaction transaction) {
    TransactionResponse response = new TransactionResponse();
    response.setTransactionExternalId(transaction.getTransactionExternalId());
    response.setTransactionType(new TransactionResponse.TransactionTypeDTO(transaction.getTransferTypeId()));
    response.setTransactionStatus(new TransactionResponse.TransactionStatusDTO(transaction.getStatus().name()));
    response.setValue(transaction.getTransactionValue());
    response.setCreatedAt(transaction.getCreatedAt());
    return response;
  }
}