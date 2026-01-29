package com.tec.yape.antifraud.domain.model;

import com.tec.yape.antifraud.domain.enums.TransactionStatus;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class Transaction {

    private UUID transactionExternalId;
    private UUID accountExternalIdDebit;
    private UUID accountExternalIdCredit;
    private Integer transferTypeId;
    private BigDecimal value;
    private TransactionStatus transactionStatus;
    private LocalDateTime createdAt;

}