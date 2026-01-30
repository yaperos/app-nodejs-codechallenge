package com.yape.services.transaction.application.mapper;

import com.yape.services.common.events.EventMetadata;
import com.yape.services.transaction.application.dto.RequestMetaData;
import com.yape.services.transaction.domain.model.Transaction;
import com.yape.services.transaction.domain.model.TransactionStatus;
import com.yape.services.transaction.events.TransactionCreatedEvent;
import com.yape.services.transaction.events.TransactionCreatedPayload;
import jakarta.enterprise.context.ApplicationScoped;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

/**
 * Mapper for transaction Avro events.
 * Note: This mapper handles Avro-specific builders which are not suitable for MapStruct.
 */
@ApplicationScoped
public class TransactionMapper {

  private static final String EVENT_TYPE = "TRANSACTION_CREATED";
  private static final String EVENT_SOURCE = "ms-transaction";
  private static final String EVENT_VERSION = "1.0.0";

  /**
   * Maps Transaction and RequestMetaData to TransactionCreatedEvent.
   *
   * @param tx       the transaction
   * @param txStatus the transaction status
   * @param metaData the request metadata
   * @return the transaction created event
   */
  public TransactionCreatedEvent toTransactionCreatedEvent(Transaction tx,
                                                           TransactionStatus txStatus,
                                                           RequestMetaData metaData) {
    String timestamp = DateTimeFormatter.ISO_INSTANT.format(Instant.now());

    EventMetadata metadata = EventMetadata.newBuilder()
        .setEventId(UUID.randomUUID().toString())
        .setEventType(EVENT_TYPE)
        .setEventTimestamp(timestamp)
        .setSource(EVENT_SOURCE)
        .setVersion(EVENT_VERSION)
        .setRequestId(metaData != null ? metaData.requestId() : null)
        .build();

    TransactionCreatedPayload payload = TransactionCreatedPayload.newBuilder()
        .setTransactionExternalId(tx.getTransactionExternalId().toString())
        .setAccountExternalIdDebit(tx.getAccountExternalIdDebit().toString())
        .setAccountExternalIdCredit(tx.getAccountExternalIdCredit().toString())
        .setTransferTypeId(tx.getTransferTypeId())
        .setValue(tx.getValue().toPlainString())
        .setStatus(com.yape.services.transaction.events.enums.TransactionStatus
            .valueOf(txStatus.getCode()))
        .setCreatedAt(timestamp)
        .build();

    return TransactionCreatedEvent.newBuilder()
        .setMetadata(metadata)
        .setPayload(payload)
        .build();
  }

}
