package com.jotace.antifraud.application.port.out;

import java.util.UUID;

public interface TransactionStatusPublisherPort {

    void publishStatusUpdate(UUID transactionExternalId, String newStatus);

}
