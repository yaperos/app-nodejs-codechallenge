package com.yape.challenge.transaction.application.command;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Command to create a new transaction
 */
@Data
@Builder
public class CreateTransactionCommand {
    private UUID accountExternalIdDebit;
    private UUID accountExternalIdCredit;
    private Integer tranferTypeId;
    private BigDecimal value;
}
