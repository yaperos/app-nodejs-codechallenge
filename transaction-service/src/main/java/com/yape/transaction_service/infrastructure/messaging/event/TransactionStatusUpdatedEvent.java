package com.yape.transaction_service.infrastructure.messaging.event;

import lombok.*;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransactionStatusUpdatedEvent {
    private UUID transactionExternalId;
    private String status;
}
