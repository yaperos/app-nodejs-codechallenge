package com.yape.services.transaction.domain.service;

import com.yape.services.transaction.events.TransactionStatusUpdatedEvent;

/**
 * Interface for publishing transaction status update events.
 */
public interface TransactionStatusEventPublisher {

  /**
   * Publishes a transaction status updated event.
   *
   * @param event the event to publish
   */
  void publishStatusUpdated(TransactionStatusUpdatedEvent event);

}
