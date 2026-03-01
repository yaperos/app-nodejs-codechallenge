package com.retotecnico.transaction.application.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTransactionRequest {

    @NotNull(message = "accountExternalIdDebit is required")
    private UUID accountExternalIdDebit;

    @NotNull(message = "accountExternalIdCredit is required")
    private UUID accountExternalIdCredit;

    @Positive(message = "tranferTypeId must be positive")
    private int tranferTypeId;

    @NotNull(message = "value is required")
    @Positive(message = "value must be positive")
    private BigDecimal value;
}
