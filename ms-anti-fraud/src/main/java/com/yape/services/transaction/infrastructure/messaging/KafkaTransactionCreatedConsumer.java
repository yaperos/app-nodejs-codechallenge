package com.yape.services.transaction.infrastructure.messaging;

import com.yape.services.transaction.application.usecase.ValidateTransactionUseCase;
import com.yape.services.transaction.events.TransactionCreatedEvent;
import io.smallrye.reactive.messaging.kafka.Record;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.reactive.messaging.Incoming;
import org.jboss.logging.Logger;

/**
 * Kafka consumer for transaction created events.
 * Listens to the 'transaction.created' topic and delegates to the validation use case.
 */
@ApplicationScoped
public class KafkaTransactionCreatedConsumer {

  private static final Logger LOGGER = Logger.getLogger(KafkaTransactionCreatedConsumer.class);

  private final ValidateTransactionUseCase validateTransactionUseCase;

  /**
   * Constructor for KafkaTransactionCreatedConsumer.
   *
   * @param validateTransactionUseCase the use case for validating transactions
   */
  @Inject
  public KafkaTransactionCreatedConsumer(ValidateTransactionUseCase validateTransactionUseCase) {
    this.validateTransactionUseCase = validateTransactionUseCase;
  }

  /**
   * Consumes transaction created events from Kafka.
   *
   * @param kafkaRecord the Kafka record containing the transaction created event
   */
  @Incoming("transaction-created-consumer")
  public void consume(Record<String, TransactionCreatedEvent> kafkaRecord) {
    String key = kafkaRecord.key();
    TransactionCreatedEvent event = kafkaRecord.value();

    LOGGER.infof("Received TransactionCreatedEvent with key: %s", key);

    try {
      validateTransactionUseCase.execute(event);
    } catch (Exception e) {
      LOGGER.errorf(e, "Error processing TransactionCreatedEvent with key: %s", key);
      throw e;
    }
  }

}
