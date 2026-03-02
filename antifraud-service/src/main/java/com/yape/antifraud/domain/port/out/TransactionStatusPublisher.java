package com.yape.antifraud.domain.port.out;

import java.util.UUID;

/**
 * Output port for publishing transaction status updates.
 * Implemented by the Kafka producer in the infrastructure layer.
 */
public interface TransactionStatusPublisher {

    /**
     * Publishes a status update for a given transaction.
     *
     * @param transactionId the transaction identifier
     * @param status        the evaluation status ("APPROVED" or "REJECTED")
     */
    void publishStatusUpdate(UUID transactionId, String status);
}
