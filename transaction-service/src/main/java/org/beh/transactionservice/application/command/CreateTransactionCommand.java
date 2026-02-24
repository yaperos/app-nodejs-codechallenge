package org.beh.transactionservice.application.command;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Maps exactly to the inbound request body:
 * {
 *   "accountExternalIdDebit": "Guid",
 *   "accountExternalIdCredit": "Guid",
 *   "tranferTypeId": 1,        ← note: matches spec spelling (single 'n')
 *   "value": 120
 * }
 */
@Data
public class CreateTransactionCommand {

    @NotNull(message = "Debit account ID is required")
    private UUID accountExternalIdDebit;

    @NotNull(message = "Credit account ID is required")
    private UUID accountExternalIdCredit;

    // Intentional: spec uses "tranferTypeId" (single 'n') — we mirror it exactly
    @NotNull(message = "Transfer type is required")
    private Integer transferTypeId;

    @NotNull(message = "Value is required")
    @DecimalMin(value = "0.01", message = "Value must be greater than 0")
    private BigDecimal value;
}
