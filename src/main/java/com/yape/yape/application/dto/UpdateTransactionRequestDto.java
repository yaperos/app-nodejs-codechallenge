package com.yape.yape.application.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateTransactionRequestDto {

    @NotNull
    private UUID accountExternalIdDebit;

    @NotNull
    private UUID accountExternalIdCredit;

    @NotNull
    @DecimalMin(value = "0.01")
    private BigDecimal value;
}
