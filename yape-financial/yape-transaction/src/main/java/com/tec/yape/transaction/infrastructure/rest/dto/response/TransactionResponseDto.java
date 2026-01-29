package com.tec.yape.transaction.infrastructure.rest.dto.response;

import com.tec.yape.transaction.domain.model.TransactionStatus;
import com.tec.yape.transaction.domain.model.TransactionType;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Setter
@Getter
public class TransactionResponseDto {

    private UUID transactionExternalId;

    private TransactionType transactionType;

    private TransactionStatus transactionStatus;

    private BigDecimal value;

    private LocalDateTime createdAt;

}
