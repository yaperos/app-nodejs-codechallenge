package com.yape.services.transaction.infrastructure.messaging;

import com.yape.services.transaction.domain.service.TransactionStatusEventPublisher;
import com.yape.services.transaction.events.TransactionStatusUpdatedEvent;
import io.smallrye.reactive.messaging.kafka.Record;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.reactive.messaging.Channel;
import org.eclipse.microprofile.reactive.messaging.Emitter;
import org.jboss.logging.Logger;

/**
 * Kafka implementation of TransactionStatusEventPublisher.
 * Publishes transaction status update events to Kafka topics.
 */
@ApplicationScoped
public class KafkaTransactionStatusPublisher implements TransactionStatusEventPublisher {

  private static final Logger LOGGER = Logger.getLogger(KafkaTransactionStatusPublisher.class);

  private final Emitter<Record<String, TransactionStatusUpdatedEvent>> statusUpdatedEmitter;

  /**
   * Constructor for KafkaTransactionStatusPublisher.
   *
   * @param statusUpdatedEmitter the emitter for transaction status updated events
   */
  @Inject
  public KafkaTransactionStatusPublisher(
      @Channel("transaction-status-producer")
      Emitter<Record<String, TransactionStatusUpdatedEvent>> statusUpdatedEmitter
  ) {
    this.statusUpdatedEmitter = statusUpdatedEmitter;
  }

  @Override
  public void publishStatusUpdated(TransactionStatusUpdatedEvent event) {
    String key = event.getPayload().getTransactionExternalId();

    LOGGER.infof("Publishing TransactionStatusUpdatedEvent with key: %s, status: %s",
        key, event.getPayload().getNewStatus());

    statusUpdatedEmitter.send(Record.of(key, event))
        .whenComplete((result, error) -> {
          if (error != null) {
            LOGGER.errorf(error,
                "Failed to publish TransactionStatusUpdatedEvent with key: %s", key);
          } else {
            LOGGER.infof("Successfully published TransactionStatusUpdatedEvent with key: %s", key);
          }
        });
  }

}
