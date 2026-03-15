package com.challenge.transaction.core.domain.model;

import com.challenge.transaction.core.domain.enums.TransactionStatus;
import lombok.Getter;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class Transaction implements Serializable {

    @Serial
    private static final long serialVersionUID = -1915736314429727217L;

    private UUID transactionExternalId;
    private UUID accountExternalIdDebit;
    private UUID accountExternalIdCredit;
    private TransactionType transactionType;
    private Double value;
    private TransactionStatus status;
    private LocalDateTime createdAt;
}
