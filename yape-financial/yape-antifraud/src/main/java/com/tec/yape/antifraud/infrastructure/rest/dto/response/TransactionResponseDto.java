package com.tec.yape.antifraud.infrastructure.rest.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Setter
@Getter
public class TransactionResponseDto {

    private UUID transactionExternalId;

    private TransactionTypeDto transactionType;

    private TransactionStatusDto transactionStatus;

    private BigDecimal value;

    private LocalDateTime createdAt;

}
