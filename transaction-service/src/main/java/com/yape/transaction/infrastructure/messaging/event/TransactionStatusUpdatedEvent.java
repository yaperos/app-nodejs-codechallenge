package com.yape.transaction.infrastructure.messaging.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Evento recibido cuando se actualiza el estado de una transacción
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionStatusUpdatedEvent {
    private String eventId;
    private String eventType;
    private String timestamp;
    private UUID correlationId; // transactionExternalId
    private UUID transactionExternalId;
    private String newStatus;
    private String reason;
}

