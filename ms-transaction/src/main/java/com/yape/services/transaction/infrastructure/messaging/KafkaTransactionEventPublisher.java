package com.yape.services.transaction.infrastructure.messaging;

import com.yape.services.transaction.domain.service.TransactionEventPublisher;
import com.yape.services.transaction.events.TransactionCreatedEvent;
import io.smallrye.reactive.messaging.kafka.Record;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.reactive.messaging.Channel;
import org.eclipse.microprofile.reactive.messaging.Emitter;
import org.jboss.logging.Logger;

/**
 * Kafka implementation of TransactionEventPublisher.
 * Publishes transaction events to Kafka topics using MicroProfile Reactive Messaging.
 */
@ApplicationScoped
public class KafkaTransactionEventPublisher implements TransactionEventPublisher {

  private static final Logger LOGGER = Logger.getLogger(KafkaTransactionEventPublisher.class);

  private final Emitter<Record<String, TransactionCreatedEvent>> transactionCreatedEmitter;

  /**
   * Constructor for KafkaTransactionEventPublisher.
   *
   * @param transactionCreatedEmitter the emitter for transaction created events
   */
  @Inject
  public KafkaTransactionEventPublisher(
      @Channel("transaction-producer")
      Emitter<Record<String, TransactionCreatedEvent>> transactionCreatedEmitter
  ) {
    this.transactionCreatedEmitter = transactionCreatedEmitter;
  }

  @Override
  public void publishTransactionCreated(TransactionCreatedEvent event) {
    String key = event.getPayload().getTransactionExternalId();

    LOGGER.infof("Publishing TransactionCreatedEvent with key: %s", key);

    transactionCreatedEmitter.send(Record.of(key, event))
        .whenComplete((result, error) -> {
          if (error != null) {
            LOGGER.errorf(error, "Failed to publish TransactionCreatedEvent with key: %s", key);
          } else {
            LOGGER.infof("Successfully published TransactionCreatedEvent with key: %s", key);
          }
        });
  }

}
