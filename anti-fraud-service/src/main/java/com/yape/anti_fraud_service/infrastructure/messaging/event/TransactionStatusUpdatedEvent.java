package com.yape.anti_fraud_service.infrastructure.messaging.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionStatusUpdatedEvent {
    private UUID transactionExternalId;
    private String status;
}
