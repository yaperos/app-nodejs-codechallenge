package com.yape.challenge.transaction.application.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

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
    @Positive(message = "tranferTypeId must be positive")
    private Integer tranferTypeId;

    @NotNull(message = "value is required")
    @Positive(message = "value must be positive")
    private BigDecimal value;
}


