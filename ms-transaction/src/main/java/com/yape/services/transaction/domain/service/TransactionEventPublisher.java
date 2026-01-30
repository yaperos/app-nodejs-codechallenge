package com.yape.services.transaction.domain.service;

import com.yape.services.transaction.events.TransactionCreatedEvent;

/**
 * Interface for publishing transaction-related events.
 */
public interface TransactionEventPublisher {

  /**
   * Publishes a TransactionCreatedEvent.
   *
   * @param event the event to publish
   */
  void publishTransactionCreated(TransactionCreatedEvent event);

}
