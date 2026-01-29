package com.tec.yape.antifraud.infrastructure.rest.dto.request;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
public class TransactionRequestDto {

    private UUID accountExternalIdDebit;

    private UUID accountExternalIdCredit;

    @JsonProperty("tranferTypeId")
    private Integer transferTypeId;

    private BigDecimal value;


}
