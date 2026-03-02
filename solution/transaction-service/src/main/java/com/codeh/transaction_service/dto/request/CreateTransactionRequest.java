package com.codeh.transaction_service.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateTransactionRequest {

    @NotNull
    private UUID accountExternalIdDebit;

    @NotNull
    private UUID accountExternalIdCredit;

    @NotNull
    private Long transferTypeId;

    @NotNull
    @Positive
    private BigDecimal value;
}
