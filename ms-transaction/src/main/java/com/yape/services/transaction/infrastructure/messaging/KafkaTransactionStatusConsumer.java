package com.yape.services.transaction.infrastructure.messaging;

import com.yape.services.transaction.application.usecase.UpdateTransactionStatusUseCase;
import com.yape.services.transaction.events.TransactionStatusUpdatedEvent;
import io.smallrye.reactive.messaging.kafka.Record;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.reactive.messaging.Incoming;
import org.jboss.logging.Logger;

/**
 * Kafka consumer for transaction status updated events.
 * Listens to the 'transaction.status' topic and delegates to the update use case.
 */
@ApplicationScoped
public class KafkaTransactionStatusConsumer {

  private static final Logger LOGGER = Logger.getLogger(KafkaTransactionStatusConsumer.class);

  private final UpdateTransactionStatusUseCase updateTransactionStatusUseCase;

  /**
   * Constructor for KafkaTransactionStatusConsumer.
   *
   * @param updateTransactionStatusUseCase the use case for updating transaction status
   */
  @Inject
  public KafkaTransactionStatusConsumer(
      UpdateTransactionStatusUseCase updateTransactionStatusUseCase) {
    this.updateTransactionStatusUseCase = updateTransactionStatusUseCase;
  }

  /**
   * Consumes transaction status updated events from Kafka.
   *
   * @param kafkaRecord the Kafka record containing the transaction status updated event
   */
  @Incoming("transaction-status-consumer")
  public void consume(Record<String, TransactionStatusUpdatedEvent> kafkaRecord) {
    String key = kafkaRecord.key();
    TransactionStatusUpdatedEvent event = kafkaRecord.value();

    LOGGER.infof("Received TransactionStatusUpdatedEvent with key: %s", key);

    try {
      updateTransactionStatusUseCase.execute(event);
      LOGGER.infof("Successfully processed TransactionStatusUpdatedEvent with key: %s", key);
    } catch (Exception e) {
      LOGGER.errorf(e, "Error processing TransactionStatusUpdatedEvent with key: %s", key);
      throw e;
    }
  }

}
