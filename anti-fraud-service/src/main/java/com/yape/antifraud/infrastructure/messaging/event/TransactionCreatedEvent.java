package com.yape.antifraud.infrastructure.messaging.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Evento recibido cuando se crea una transacción
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionCreatedEvent {
    private String eventId;
    private String eventType;
    private String timestamp;
    private UUID transactionExternalId;
    private UUID accountExternalIdDebit;
    private UUID accountExternalIdCredit;
    private Integer transferTypeId;
    private BigDecimal value;
}

