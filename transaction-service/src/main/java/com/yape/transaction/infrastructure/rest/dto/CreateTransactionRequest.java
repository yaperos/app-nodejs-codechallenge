package com.yape.transaction.infrastructure.rest.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
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

    @JsonProperty("accountExternalIdDebit")
    private UUID accountExternalIdDebit;

    @JsonProperty("accountExternalIdCredit")
    private UUID accountExternalIdCredit;

    @JsonProperty("tranferTypeId")
    private int tranferTypeId;

    @JsonProperty("value")
    private BigDecimal value;
}
