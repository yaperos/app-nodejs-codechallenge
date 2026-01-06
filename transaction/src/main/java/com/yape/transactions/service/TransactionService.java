package com.yape.transactions.service;

import com.yape.transactions.api.dto.CreateTransactionRequest;
import com.yape.transactions.api.dto.TransactionResponse;
import com.yape.transactions.domain.TransactionEntity;
import com.yape.transactions.domain.TransactionRepository;
import com.yape.transactions.kafka.TransactionCreatedEvent;
import com.yape.transactions.kafka.TransactionEventsPublisher;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
public class TransactionService {

  private final TransactionRepository repository;
  private final TransactionEventsPublisher publisher;

  public TransactionService(TransactionRepository repository, TransactionEventsPublisher publisher) {
    this.repository = repository;
    this.publisher = publisher;
  }

  public String createTransaction(CreateTransactionRequest request) {
    UUID externalId = UUID.randomUUID();

    TransactionEntity entity = new TransactionEntity(
        externalId,
        request.accountExternalIdDebit(),
        request.accountExternalIdCredit(),
        request.tranferTypeId(),
        request.value(),
        "pending",
        Instant.now()
    );

    repository.save(entity);

    // Emit event for anti-fraud validation
    publisher.publishCreated(new TransactionCreatedEvent(
        externalId.toString(),
        request.accountExternalIdDebit(),
        request.accountExternalIdCredit(),
        request.tranferTypeId(),
        request.value()
    ));

    return externalId.toString();
  }

  public TransactionResponse getTransaction(String transactionExternalId) {
    UUID id = parseUuid(transactionExternalId);

    TransactionEntity entity = repository.findByTransactionExternalId(id)
        .orElseThrow(() -> new TransactionNotFoundException(transactionExternalId));

    String typeName = "transferType-" + entity.getTranferTypeId();

    return new TransactionResponse(
        entity.getTransactionExternalId().toString(),
        new TransactionResponse.NamedDto(typeName),
        new TransactionResponse.NamedDto(entity.getStatus()),
        entity.getValue(),
        entity.getCreatedAt()
    );
  }

  private UUID parseUuid(String raw) {
    try {
      return UUID.fromString(raw);
    } catch (IllegalArgumentException ex) {
      throw new InvalidUuidException(raw);
    }
  }
}
