package com.yape.transactionservice.dto.response;

import com.yape.transactionservice.entity.TransactionStatus;
import com.yape.transactionservice.entity.TransactionType;
import lombok.Data;

import java.math.BigInteger;
import java.time.LocalDateTime;

@Data
public class TransactionResponse {

    private Long transactionExternalId;
    private TransactionType transactionType;
    private TransactionStatus transactionStatus;
    private Double amount;
    private LocalDateTime createdAt;

}
