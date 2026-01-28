package com.transactions.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AntiFraudService {

  private static final BigDecimal MAX_AMOUNT = new BigDecimal("1000");
  private final TransactionService transactionService;

  @KafkaListener(topics = "transaction.created", groupId = "anti-fraud-group")
  public void validateTransaction(Map<String, Object> message) {
    try {
      UUID transactionExternalId = UUID.fromString((String) message.get("transactionExternalId"));
      BigDecimal value = new BigDecimal(message.get("value").toString());

      log.info("Validating transaction: {}, value: {}", transactionExternalId, value);

      // Regla: valor > 1000 = rechazado
      if (value.compareTo(MAX_AMOUNT) > 0) {
        transactionService.updateTransactionStatus(
          transactionExternalId,
          com.transactions.model.enums.TransactionStatus.REJECTED,
          "Transaction value exceeds maximum allowed limit of 1000"
        );
        log.warn("Transaction {} REJECTED: value {} > {}",
          transactionExternalId, value, MAX_AMOUNT);
      } else {
        transactionService.updateTransactionStatus(
          transactionExternalId,
          com.transactions.model.enums.TransactionStatus.APPROVED,
          null
        );
        log.info("Transaction {} APPROVED", transactionExternalId);
      }
    } catch (Exception e) {
      log.error("Error validating transaction: {}", e.getMessage(), e);
    }
  }
}