package com.yape.transaction.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Comando para crear una transacción
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateTransactionCommand {
    private UUID accountExternalIdDebit;
    private UUID accountExternalIdCredit;
    private Integer tranferTypeId;
    private BigDecimal value;
}

