package com.desafio.yape.dto;

import lombok.Data;

@Data
public class CreateTransactionRequest {
    private String accountExternalIdDebit;
    private String accountExternalIdCredit;
    private Integer tranferTypeId;
    private Double value;
}
