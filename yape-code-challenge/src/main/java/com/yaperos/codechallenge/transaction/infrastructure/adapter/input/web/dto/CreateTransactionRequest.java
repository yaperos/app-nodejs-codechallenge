package com.yaperos.codechallenge.transaction.infrastructure.adapter.input.web.dto;

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
    @Positive
    private Integer tranferTypeId;

    @NotNull
    @Positive
    private BigDecimal value;

}
