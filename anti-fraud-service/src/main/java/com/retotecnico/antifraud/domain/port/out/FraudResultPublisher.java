package com.retotecnico.antifraud.domain.port.out;

import java.util.UUID;

/**
 * Output port - publishes fraud validation result.
 */
public interface FraudResultPublisher {

    void publishResult(UUID transactionExternalId, String status);
}
