package com.yape.transactionservice.dto.request;

import lombok.Data;

import java.math.BigInteger;

@Data
public class CreateTransactionRequest {

    private BigInteger accountExternalIdDebit;
    private BigInteger accountExternalIdCredit;
    private Long tranferTypeId;
    private Double amount;

}
