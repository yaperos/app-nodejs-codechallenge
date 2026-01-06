package com.yape.transaction.infrastructure.api.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * DTO de request para crear transacción
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateTransactionRequest {

    @NotNull(message = "accountExternalIdDebit is required")
    private UUID accountExternalIdDebit;

    @NotNull(message = "accountExternalIdCredit is required")
    private UUID accountExternalIdCredit;

    @NotNull(message = "tranferTypeId is required")
    private Integer tranferTypeId;

    @NotNull(message = "value is required")
    @DecimalMin(value = "0.01", message = "value must be greater than zero")
    private BigDecimal value;
}

