package com.yape.challenge.transaction.infrastructure.adapters.in.web.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class CreateTransactionRequest {
    private UUID accountExternalIdDebit;
    private UUID accountExternalIdCredit;
    private Integer tranferTypeId;
    private Double value;
}
