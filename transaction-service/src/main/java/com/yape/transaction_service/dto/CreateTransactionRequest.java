package com.yape.transaction_service.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Setter
@Getter
public class CreateTransactionRequest {

    private UUID accountExternalIdDebit;
    private UUID accountExternalIdCredit;
    private Integer transferTypeId;
    private BigDecimal value;

    public CreateTransactionRequest(UUID accountExternalIdDebit, UUID accountExternalIdCredit, Integer transferTypeId, BigDecimal value) {
        this.accountExternalIdDebit = accountExternalIdDebit;
        this.accountExternalIdCredit = accountExternalIdCredit;
        this.transferTypeId = transferTypeId;
        this.value = value;
    }
}
