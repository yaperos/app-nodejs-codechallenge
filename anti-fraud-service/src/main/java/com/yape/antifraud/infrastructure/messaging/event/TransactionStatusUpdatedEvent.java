package com.yape.antifraud.infrastructure.messaging.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Evento publicado cuando se valida una transacción
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionStatusUpdatedEvent {
    private String eventId;
    private String eventType;
    private String timestamp;
    private UUID correlationId;
    private UUID transactionExternalId;
    private String newStatus;
    private String reason;
}

