package com.yape.services.transaction.application.command;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Command to create a new transaction.
 */
public record CreateTransactionCommand(
    UUID accountExternalIdDebit,
    UUID accountExternalIdCredit,
    Integer transferTypeId,
    Integer transactionStatusId,
    String transactionStatusCode,
    BigDecimal value
) {}
