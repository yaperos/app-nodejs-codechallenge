package com.yape.transactions.kafka;

import com.yape.transactions.domain.TransactionRepository;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.Locale;
import java.util.UUID;

@Component
public class TransactionStatusListener {

  private final TransactionRepository repository;

  public TransactionStatusListener(TransactionRepository repository) {
    this.repository = repository;
  }

  @KafkaListener(topics = "${app.topics.status}", groupId = "transaction-service")
  public void onStatus(TransactionStatusEvent event) {
    UUID externalId;
    try {
      externalId = UUID.fromString(event.transactionExternalId());
    } catch (IllegalArgumentException ex) {
      return; // ignore malformed event
    }

    String normalized = event.status() == null ? null : event.status().toLowerCase(Locale.ROOT);

    if (normalized == null || (!normalized.equals("approved") && !normalized.equals("rejected") && !normalized.equals("pending"))) {
      return; // ignore unknown status
    }

    repository.findByTransactionExternalId(externalId).ifPresent(tx -> {
      // idempotent-ish update
      if (!normalized.equals(tx.getStatus())) {
        tx.setStatus(normalized);
        repository.save(tx);
      }
    });
  }
}
